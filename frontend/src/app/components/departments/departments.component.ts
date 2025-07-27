import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
})
export class DepartmentsComponent implements OnInit {
  dataSource = {
    data: [] as Department[],
    filteredData: [] as Department[],
  };
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
    private fb: FormBuilder
  ) {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      managerId: [''],
    });
  }

  ngOnInit(): void {
    // First try to get the current user value
    this.currentUser = this.authService.getCurrentUserValue();
    console.log('Initial currentUser:', this.currentUser);
    
    // If no user, try to subscribe to the current user observable
    if (!this.currentUser) {
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        console.log('User from observable:', this.currentUser);
      });
    }
    
    this.loadDepartments();
    this.loadEmployees();
  }

  loadDepartments(): void {
    this.loading = true;
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => {
        this.dataSource.data = departments;
        this.dataSource.filteredData = departments;
        this.loadDepartmentEmployees(departments);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
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
    const searchTerm = filterValue.trim().toLowerCase();

    this.dataSource.filteredData = this.dataSource.data.filter(
      (department) =>
        department.name.toLowerCase().includes(searchTerm) ||
        (department.description &&
          department.description.toLowerCase().includes(searchTerm))
    );
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
              console.log('Department updated successfully!');
              this.loadDepartments();
              this.cancelForm();
              this.loading = false;
            },
            error: (error) => {
              console.error('Error updating department:', error.message);
              this.loading = false;
            },
          });
      } else {
        // Create new department
        const createDto: CreateDepartmentDto = formValue;

        this.departmentService.createDepartment(createDto).subscribe({
          next: () => {
            console.log('Department created successfully!');
            this.loadDepartments();
            this.cancelForm();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error creating department:', error.message);
            this.loading = false;
          },
        });
      }
    }
  }

  deleteDepartment(department: Department): void {
    const employeeCount = this.getDepartmentEmployeeCount(department.id);
    if (employeeCount > 0) {
      alert(
        'Cannot delete department with employees. Please reassign employees first.'
      );
      return;
    }

    if (confirm(`Are you sure you want to delete ${department.name}?`)) {
      this.loading = true;
      this.departmentService.deleteDepartment(department.id).subscribe({
        next: () => {
          console.log('Department deleted successfully!');
          this.loadDepartments();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting department:', error.message);
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

  getManagerName(managerId: number | null | undefined): string {
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
