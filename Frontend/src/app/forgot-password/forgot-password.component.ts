import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, ForgotPassword } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const forgotPasswordData : ForgotPassword = this.forgotPasswordForm.value as ForgotPassword;
      console.log("Form submitted", forgotPasswordData)
      this.auth.verifyUser(forgotPasswordData).subscribe({
        next: () => {
          this.router.navigate(['/reset-password'], {
            queryParams: {
              username: forgotPasswordData.username,
              email: forgotPasswordData.email
            }
          });
        },
        error: (err) => {
          alert('Error: ' + err?.error.message);
        }
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
      alert('Please enter valid details.');
    }
  }
}
