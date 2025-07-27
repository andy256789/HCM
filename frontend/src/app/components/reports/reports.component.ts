import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Employee } from '../../models/employee.model';
import { Department } from '../../models/department.model';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { AuthService } from '../../services/auth.service';

interface DepartmentSummary {
  department: Department;
  employeeCount: number;
  totalSalary: number;
  averageSalary: number;
  employees: Employee[];
}

interface SalaryRange {
  range: string;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatGridListModule,
    MatChipsModule,
    MatDividerModule,
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  loading = false;
  employees: Employee[] = [];
  departments: Department[] = [];
  departmentSummaries: DepartmentSummary[] = [];
  salaryRanges: SalaryRange[] = [];
  currentUser: any;

  // Statistics
  totalEmployees = 0;
  totalDepartments = 0;
  averageSalary = 0;
  totalPayroll = 0;
  highestPaidEmployee: Employee | null = null;
  lowestPaidEmployee: Employee | null = null;

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    Promise.all([
      this.employeeService.getAllEmployees().toPromise(),
      this.departmentService.getAllDepartments().toPromise(),
    ])
      .then(([employees, departments]) => {
        this.employees = employees || [];
        this.departments = departments || [];

        this.calculateStatistics();
        this.calculateDepartmentSummaries();
        this.calculateSalaryRanges();

        this.loading = false;
      })
      .catch((error) => {
        console.error('Error loading data:', error);
        this.loading = false;
      });
  }

  calculateStatistics(): void {
    this.totalEmployees = this.employees.length;
    this.totalDepartments = this.departments.length;

    if (this.employees.length > 0) {
      this.totalPayroll = this.employees.reduce(
        (sum, emp) => sum + emp.salary,
        0
      );
      this.averageSalary = this.totalPayroll / this.employees.length;

      this.highestPaidEmployee = this.employees.reduce((prev, current) =>
        prev.salary > current.salary ? prev : current
      );

      this.lowestPaidEmployee = this.employees.reduce((prev, current) =>
        prev.salary < current.salary ? prev : current
      );
    }
  }

  calculateDepartmentSummaries(): void {
    this.departmentSummaries = this.departments
      .map((dept) => {
        const deptEmployees = this.employees.filter(
          (emp) => emp.departmentId === dept.id
        );
        const totalSalary = deptEmployees.reduce(
          (sum, emp) => sum + emp.salary,
          0
        );

        return {
          department: dept,
          employeeCount: deptEmployees.length,
          totalSalary: totalSalary,
          averageSalary:
            deptEmployees.length > 0 ? totalSalary / deptEmployees.length : 0,
          employees: deptEmployees,
        };
      })
      .sort((a, b) => b.employeeCount - a.employeeCount);
  }

  calculateSalaryRanges(): void {
    const ranges = [
      { min: 0, max: 30000, label: '$0 - $30k' },
      { min: 30000, max: 50000, label: '$30k - $50k' },
      { min: 50000, max: 75000, label: '$50k - $75k' },
      { min: 75000, max: 100000, label: '$75k - $100k' },
      { min: 100000, max: Infinity, label: '$100k+' },
    ];

    this.salaryRanges = ranges
      .map((range) => {
        const count = this.employees.filter(
          (emp) => emp.salary >= range.min && emp.salary < range.max
        ).length;

        return {
          range: range.label,
          count: count,
          percentage:
            this.totalEmployees > 0 ? (count / this.totalEmployees) * 100 : 0,
        };
      })
      .filter((range) => range.count > 0);
  }

  getTopPerformers(): Employee[] {
    return this.employees.sort((a, b) => b.salary - a.salary).slice(0, 5);
  }

  getDepartmentWithMostEmployees(): DepartmentSummary | null {
    return this.departmentSummaries.length > 0
      ? this.departmentSummaries[0]
      : null;
  }

  getDepartmentWithHighestPayroll(): DepartmentSummary | null {
    return this.departmentSummaries.length > 0
      ? this.departmentSummaries.reduce((prev, current) =>
          prev.totalSalary > current.totalSalary ? prev : current
        )
      : null;
  }

  refreshData(): void {
    this.loadData();
  }

  exportReport(): void {
    // This would typically export to CSV or PDF
    console.log('Export functionality would be implemented here');
  }
}
