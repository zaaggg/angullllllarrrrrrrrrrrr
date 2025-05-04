import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordUpdateRequest } from '../model/passwordUpdateRequest.model';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class UpdatePasswordComponent {
  passwordForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  updatePassword(): void {
    if (this.passwordForm.invalid) return;

    const request: PasswordUpdateRequest = this.passwordForm.value;
    this.authService.updatePassword(request).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.errorMessage = '';
        this.passwordForm.reset();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Échec de la mise à jour.';
        this.successMessage = '';
      }
    });
  }
}
