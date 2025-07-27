import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from '../../models/employee.model';
import { Department } from '../../models/department.model';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'fullName',
    'email',
    'jobTitle',
    'departmentName',
    'salary',
    'actions',
  ];
  dataSource = new MatTableDataSource<Employee>();
  departments: Department[] = [];
  loading = false;
  showForm = false;
  editingEmployee: Employee | null = null;
  currentUser: any;

  employeeForm: FormGroup;

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private authService: AuthService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(100)],
      ],
      jobTitle: ['', [Validators.required, Validators.maxLength(100)]],
      salary: ['', [Validators.required, Validators.min(0)]],
      departmentId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadEmployees();
    this.loadDepartments();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.dataSource.data = employees;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open(
          'Error loading employees: ' + error.message,
          'Close',
          {
            duration: 5000,
            panelClass: ['error-snackbar'],
          }
        );
        this.loading = false;
      },
    });
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: (error) => {
        this.snackBar.open(
          'Error loading departments: ' + error.message,
          'Close',
          {
            duration: 5000,
            panelClass: ['error-snackbar'],
          }
        );
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  showAddForm(): void {
    this.editingEmployee = null;
    this.employeeForm.reset();
    this.showForm = true;
  }

  editEmployee(employee: Employee): void {
    this.editingEmployee = employee;
    this.employeeForm.patchValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      jobTitle: employee.jobTitle,
      salary: employee.salary,
      departmentId: employee.departmentId,
    });
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingEmployee = null;
    this.employeeForm.reset();
  }

  saveEmployee(): void {
    if (this.employeeForm.valid) {
      this.loading = true;
      const formValue = this.employeeForm.value;

      if (this.editingEmployee) {
        // Update existing employee
        const updateDto: UpdateEmployeeDto = {
          id: this.editingEmployee.id,
          ...formValue,
        };

        this.employeeService
          .updateEmployee(this.editingEmployee.id, updateDto)
          .subscribe({
            next: () => {
              this.snackBar.open('Employee updated successfully!', 'Close', {
                duration: 3000,
                panelClass: ['success-snackbar'],
              });
              this.loadEmployees();
              this.cancelForm();
              this.loading = false;
            },
            error: (error) => {
              this.snackBar.open(
                'Error updating employee: ' + error.message,
                'Close',
                {
                  duration: 5000,
                  panelClass: ['error-snackbar'],
                }
              );
              this.loading = false;
            },
          });
      } else {
        // Create new employee
        const createDto: CreateEmployeeDto = formValue;

        this.employeeService.createEmployee(createDto).subscribe({
          next: () => {
            this.snackBar.open('Employee created successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar'],
            });
            this.loadEmployees();
            this.cancelForm();
            this.loading = false;
          },
          error: (error) => {
            this.snackBar.open(
              'Error creating employee: ' + error.message,
              'Close',
              {
                duration: 5000,
                panelClass: ['error-snackbar'],
              }
            );
            this.loading = false;
          },
        });
      }
    }
  }

  deleteEmployee(employee: Employee): void {
    if (confirm(`Are you sure you want to delete ${employee.fullName}?`)) {
      this.loading = true;
      this.employeeService.deleteEmployee(employee.id).subscribe({
        next: () => {
          this.snackBar.open('Employee deleted successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.loadEmployees();
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open(
            'Error deleting employee: ' + error.message,
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            }
          );
          this.loading = false;
        },
      });
    }
  }

  canEdit(): boolean {
    return (
      this.currentUser?.roleName === 'HR Admin' ||
      this.currentUser?.roleName === 'Manager'
    );
  }

  canDelete(): boolean {
    return this.currentUser?.roleName === 'HR Admin';
  }

  getDepartmentName(departmentId: number): string {
    const department = this.departments.find((d) => d.id === departmentId);
    return department ? department.name : 'Unknown';
  }
}
