import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, ResetPassword } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  username!: string;
  email!: string;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
      this.email = params['email'];
    });

    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { 
      validator: this.passwordMatchValidator 
    });
  }

  passwordMatchValidator(formGroup: FormGroup): void {
    const password = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'newPassword') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      const newPasswordData: ResetPassword = {
        username: this.username,
        email: this.email,
        newPassword: this.resetPasswordForm.value.newPassword,
        confirmPassword: this.resetPasswordForm.value.confirmPassword
      };
      console.log("Form submitted", newPasswordData);
      this.auth.resetPassword(newPasswordData).subscribe({
        next: () => {
          alert('Password has been reset successfully!');
          this.router.navigate(['/login']);
        },
        error: (err => {
          console.log('Error', err);

          if (err?.err?.message) {
            alert(err.error.message);
            this.resetPasswordForm.reset;
          } else {
            alert('An error occured');
            this.resetPasswordForm.reset;
          }
        })
      });
    } else {
      this.resetPasswordForm.markAllAsTouched();
      alert('Please fill in all fields correctly.');
    }
  }
}



