import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { FooterComponent } from "./components/footer/footer.component";
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserManagementComponent } from "./admin/user-management/user-management.component";
import { HomeComponent } from "./components/home/home.component";
import { ProductManagementComponent } from "./admin/product-management/product-management.component";
import { BrandManagementComponent } from "./admin/brand-management/brand-management.component";
import { PromotionManagementComponent } from "./admin/promotion-management/promotion-management.component";
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PayComponent } from "./pay/pay.component";
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { ProfileComponent } from "./profile/profile.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ProductListComponent,
    FontAwesomeModule,
    UserManagementComponent,
    HomeComponent,
    ProductManagementComponent,
    BrandManagementComponent,
    PromotionManagementComponent,
    ReactiveFormsModule,
    HttpClientModule,
    PayComponent,
    FormsModule,
    ProductListComponent,
    LoginComponent,
    ProfileComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mobile-shop';

  constructor(private authService: AuthService) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
