import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Department,
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from '../models/department.model';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly baseUrl = 'http://localhost:5044/api/departments';

  constructor(private http: HttpClient) {}

  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.baseUrl);
  }

  getDepartment(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.baseUrl}/${id}`);
  }

  createDepartment(department: CreateDepartmentDto): Observable<Department> {
    return this.http.post<Department>(this.baseUrl, department);
  }

  updateDepartment(
    id: number,
    department: UpdateDepartmentDto
  ): Observable<Department> {
    return this.http.put<Department>(`${this.baseUrl}/${id}`, department);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
