import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { User } from '../../models/auth.model';
import { Employee } from '../../models/employee.model';
import { Department } from '../../models/department.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  employees: Employee[] = [];
  departments: Department[] = [];
  displayedColumns: string[] = [
    'fullName',
    'email',
    'jobTitle',
    'departmentName',
    'salary',
  ];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.loadData();
      }
    });
  }

  loadData(): void {
    this.isLoading = true;

    // Load employees
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load employees', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });

    // Load departments
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: (error) => {
        this.snackBar.open('Failed to load departments', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  canManageEmployees(): boolean {
    return (
      this.currentUser?.roleName === 'HrAdmin' ||
      this.currentUser?.roleName === 'Manager'
    );
  }

  canManageDepartments(): boolean {
    return this.currentUser?.roleName === 'HrAdmin';
  }

  testDatabaseConnection(): void {
    this.loadData();
    this.snackBar.open(
      'Database connection tested - check the data!',
      'Close',
      { duration: 3000 }
    );
  }
}
