export interface Department {
  id: number;
  name: string;
  description?: string;
  employeeCount: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
}

export interface UpdateDepartmentDto extends CreateDepartmentDto {
  id: number;
}
