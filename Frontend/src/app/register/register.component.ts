import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, LoginUser, RegisterUser } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent implements OnInit {
  showPassword = false;
  showConfirmPassword = false;
  registerForm!: FormGroup;
  formSubmitted = false;

  public dialogTitle: string = '';
  public dialogMessage: string = '';
  public isShowDialog: boolean = false;


  constructor(private fb: FormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirm-password') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  passwordMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    return password && confirmPassword && password.value !== confirmPassword.value
      ? { mismatch: true }
      : null;
  }

  onSignUp(): void {
    if (this.registerForm.valid) {
      const registerData: RegisterUser = this.registerForm.value as RegisterUser;
      console.log('Form submitted:', registerData);
      this.auth.signUp(registerData).then((response: any) => {
          if (response) {
            if (response.error) {
              // Show error message
              this.dialogTitle = 'Register Error';
              this.dialogMessage = response.error;
              this.isShowDialog = true;
            } else {
              window.location.href = '/';
            }
          }
        })
        .catch((error) => {
          // Show error message
          this.dialogTitle = 'Register Error';
          this.dialogMessage = 'Error while saving data';
          this.isShowDialog = true;
        })
    } else {
      this.validateAllFormFields(this.registerForm);
      alert("Your form is invalid");
    }
  }

  private validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  public onCloseDialog() {
    this.isShowDialog = false;
  }
}
