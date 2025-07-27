export interface Department {
  id: number;
  name: string;
  description?: string;
  managerId?: number;
  managerName?: string;
  employeeCount: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
  managerId?: number;
}

export interface UpdateDepartmentDto extends CreateDepartmentDto {
  id: number;
}
