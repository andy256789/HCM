import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginDto } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginData: LoginDto = {
    email: '',
    password: '',
  };

  isLoading = false;
  hidePassword = true;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  private showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.loginData.email || !this.loginData.password) {
      this.showError('Please fill in all fields');
      return;
    }

    this.isLoading = true;
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.showError(error.error?.message || 'Login failed');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  fillCredentials(email: string, password: string): void {
    this.loginData.email = email;
    this.loginData.password = password;
    this.errorMessage = '';
  }
}
