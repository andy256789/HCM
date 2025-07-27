import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
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
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  departments: Department[] = [];
  loading = false;
  showForm = false;
  editingEmployee: Employee | null = null;
  currentUser: any;

  employeeForm: FormGroup;

  // Simple data source for template compatibility
  get dataSource() {
    return {
      data: this.employees,
      filteredData: this.filteredEmployees,
    };
  }

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private authService: AuthService,
    private fb: FormBuilder,
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
    // Subscribe to current user changes - same pattern as dashboard
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      console.log('Current user in employees component:', this.currentUser);
      console.log('Can edit:', this.canEdit());
      console.log('Can delete:', this.canDelete());

      if (user) {
        this.loadEmployees();
        this.loadDepartments();
      }
    });
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.filteredEmployees = employees;
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
    const searchTerm = filterValue.trim().toLowerCase();

    if (searchTerm === '') {
      this.filteredEmployees = this.employees;
    } else {
      this.filteredEmployees = this.employees.filter(
        (employee) =>
          employee.fullName.toLowerCase().includes(searchTerm) ||
          employee.email.toLowerCase().includes(searchTerm) ||
          employee.jobTitle.toLowerCase().includes(searchTerm) ||
          employee.departmentName.toLowerCase().includes(searchTerm)
      );
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
    console.log('Checking canEdit - currentUser:', this.currentUser);
    console.log('Role name:', this.currentUser?.roleName);
    console.log('AuthService.isHrAdmin():', this.authService.isHrAdmin());
    console.log('AuthService.isManager():', this.authService.isManager());

    // Use AuthService methods for better reliability
    const result = this.authService.isHrAdmin() || this.authService.isManager();
    console.log('canEdit result:', result);
    return result;
  }

  canDelete(): boolean {
    console.log('Checking canDelete - currentUser:', this.currentUser);
    console.log('Role name:', this.currentUser?.roleName);
    console.log('AuthService.isHrAdmin():', this.authService.isHrAdmin());

    // Use AuthService method for better reliability
    const result = this.authService.isHrAdmin();
    console.log('canDelete result:', result);
    return result;
  }

  getDepartmentName(departmentId: number): string {
    const department = this.departments.find((d) => d.id === departmentId);
    return department ? department.name : 'Unknown';
  }
}
