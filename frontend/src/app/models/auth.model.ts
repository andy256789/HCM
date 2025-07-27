export enum UserRole {
  Employee = 1,
  Manager = 2,
  HrAdmin = 3,
}

export interface User {
  id: number;
  email: string;
  role: UserRole;
  roleName: string;
  employeeId?: number;
  employeeName?: string;
  createdAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  role: UserRole;
  employeeId?: number;
}

export interface AuthResponse {
  token: string;
  expires: Date;
  user: User;
}
