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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import {
  Department,
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from '../../models/department.model';
import { Employee } from '../../models/employee.model';
import { DepartmentService } from '../../services/department.service';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-departments',
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
    MatExpansionModule,
    MatChipsModule,
  ],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
})
export class DepartmentsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'name',
    'description',
    'managerName',
    'employeeCount',
    'actions',
  ];
  dataSource = new MatTableDataSource<Department>();
  employees: Employee[] = [];
  loading = false;
  showForm = false;
  editingDepartment: Department | null = null;
  currentUser: any;
  departmentEmployees: { [key: number]: Employee[] } = {};

  departmentForm: FormGroup;

  constructor(
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      managerId: [''],
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDepartments();
    this.loadEmployees();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadDepartments(): void {
    this.loading = true;
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => {
        this.dataSource.data = departments;
        this.loadDepartmentEmployees(departments);
        this.loading = false;
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
        this.loading = false;
      },
    });
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      },
    });
  }

  loadDepartmentEmployees(departments: Department[]): void {
    departments.forEach((dept) => {
      this.employeeService.getEmployeesByDepartment(dept.id).subscribe({
        next: (employees) => {
          this.departmentEmployees[dept.id] = employees;
        },
        error: (error) => {
          console.error(
            `Error loading employees for department ${dept.id}:`,
            error
          );
        },
      });
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
    this.editingDepartment = null;
    this.departmentForm.reset();
    this.showForm = true;
  }

  editDepartment(department: Department): void {
    this.editingDepartment = department;
    this.departmentForm.patchValue({
      name: department.name,
      description: department.description,
      managerId: department.managerId,
    });
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingDepartment = null;
    this.departmentForm.reset();
  }

  saveDepartment(): void {
    if (this.departmentForm.valid) {
      this.loading = true;
      const formValue = this.departmentForm.value;

      if (this.editingDepartment) {
        // Update existing department
        const updateDto: UpdateDepartmentDto = {
          id: this.editingDepartment.id,
          ...formValue,
        };

        this.departmentService
          .updateDepartment(this.editingDepartment.id, updateDto)
          .subscribe({
            next: () => {
              this.snackBar.open('Department updated successfully!', 'Close', {
                duration: 3000,
                panelClass: ['success-snackbar'],
              });
              this.loadDepartments();
              this.cancelForm();
              this.loading = false;
            },
            error: (error) => {
              this.snackBar.open(
                'Error updating department: ' + error.message,
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
        // Create new department
        const createDto: CreateDepartmentDto = formValue;

        this.departmentService.createDepartment(createDto).subscribe({
          next: () => {
            this.snackBar.open('Department created successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar'],
            });
            this.loadDepartments();
            this.cancelForm();
            this.loading = false;
          },
          error: (error) => {
            this.snackBar.open(
              'Error creating department: ' + error.message,
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

  deleteDepartment(department: Department): void {
    const employeeCount = this.getDepartmentEmployeeCount(department.id);
    if (employeeCount > 0) {
      this.snackBar.open(
        'Cannot delete department with employees. Please reassign employees first.',
        'Close',
        {
          duration: 5000,
          panelClass: ['error-snackbar'],
        }
      );
      return;
    }

    if (confirm(`Are you sure you want to delete ${department.name}?`)) {
      this.loading = true;
      this.departmentService.deleteDepartment(department.id).subscribe({
        next: () => {
          this.snackBar.open('Department deleted successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.loadDepartments();
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open(
            'Error deleting department: ' + error.message,
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
    return this.currentUser?.roleName === 'HR Admin';
  }

  canDelete(): boolean {
    return this.currentUser?.roleName === 'HR Admin';
  }

  getManagerName(managerId: number | null): string {
    if (!managerId) return 'No Manager';
    const manager = this.employees.find((e) => e.id === managerId);
    return manager ? manager.fullName : 'Unknown';
  }

  getDepartmentEmployeeCount(departmentId: number): number {
    return this.departmentEmployees[departmentId]?.length || 0;
  }

  getDepartmentEmployees(departmentId: number): Employee[] {
    return this.departmentEmployees[departmentId] || [];
  }

  getAvailableManagers(): Employee[] {
    return this.employees.filter(
      (employee) =>
        employee.jobTitle.toLowerCase().includes('manager') ||
        employee.jobTitle.toLowerCase().includes('director') ||
        employee.jobTitle.toLowerCase().includes('lead')
    );
  }
}
