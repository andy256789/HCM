export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  salary: number;
  departmentId: number;
  departmentName: string;
  fullName: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  salary: number;
  departmentId: number;
}

export interface UpdateEmployeeDto extends CreateEmployeeDto {
  id: number;
}
