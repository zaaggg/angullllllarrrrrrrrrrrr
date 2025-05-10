// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [

    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: res => {
        console.log('✅ Token:', res.token);
        localStorage.setItem('token', res.token);
        this.router.navigate(['/notify-list']);
      },
      error: err => {
        console.error('❌ Login failed:', err);
        alert('Login failed: ' + err.error);
      }
    });
  }

}
