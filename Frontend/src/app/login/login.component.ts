import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoginUser } from '../services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';




export interface LoginResponse{
  token : string;
  freshToke : string;
  expires : Date;
}


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule, 
    HttpClientModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  showPassword = false;

  loginForm!: FormGroup;

  private isAuthenticated: boolean = false;

  public dialogTitle: string = '';
  public dialogMessage: string = '';
  public isShowDialog: boolean = false;

  constructor(private fb: FormBuilder, private auth: AuthService,private router : Router) {}

  ngOnInit(): void {
    this.isAuthenticated = this.auth.isAuthenticated();

    if (this.isAuthenticated) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.fb.group({
      username:['', Validators.required],
      password:['', Validators.required]
    })
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    console.log('Form submitted');
  
    if (this.loginForm.valid) {
      const loginData : LoginUser = this.loginForm.value as LoginUser;
      console.log("Form submitted", loginData)
      this.auth.login(loginData).then((response: any) => {
        if (response) {
          if (response.error) {
            this.dialogTitle = 'Login Failed';
            this.dialogMessage = response.error.detail;
            this.isShowDialog = true;
          } else {
            window.location.href = '/';
          }
          
            // Lưu trạng thái đăng nhập
          this.router.navigate(['/home']);  // Chuyển hướng sau khi đăng nhập thành công
        }

        // error:(err)=>{
        //   alert(err?.error.message)
        // }
      })
    }else{
      this.validateAllFormFilled(this.loginForm);
      alert("Your form is invalid");
    }
  }

  private validateAllFormFilled(formGroup : FormGroup) {
    Object.keys(formGroup.controls).forEach(field=>{
      const control = formGroup.get(field);
      if(control instanceof FormControl) {
        control.markAsDirty({onlySelf:true});
      } else if(control instanceof FormGroup) {
        this.validateAllFormFilled(control)
      }
    })
  }
  public onCloseDialog() {
    this.isShowDialog = false;
  }
}
