import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductComponent } from './components/product/product.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { PromotionComponent } from './promotion/promotion.component';
import { CartComponent } from './use/cart/cart.component';
import { PayComponent } from './pay/pay.component';
import { ResetPasswordComponent } from  './reset-password/reset-password.component';
import { ProductManagementComponent } from './admin/product-management/product-management.component';
import { BrandManagementComponent } from './admin/brand-management/brand-management.component';
import { PromotionManagementComponent } from './admin/promotion-management/promotion-management.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'home', component:HomeComponent},
    {path:'product', component:ProductComponent},
    {path: 'login', component: LoginComponent },
    {path: 'register', component: RegisterComponent},
    {path: 'forgot-password', component: ForgotPasswordComponent},
    {path: 'promotion', component: PromotionComponent},
    {path: 'product-detail/:id', component: ProductDetailComponent },
    {path: 'cart', component:CartComponent},
    {path: 'pay', component:PayComponent},
    {path: 'reset-password', component: ResetPasswordComponent},
    {path: 'product-management' , component : ProductManagementComponent},
    {path: 'user-management', component: UserManagementComponent},
    {path: 'brand-management', component: BrandManagementComponent},
    {path: 'promotion-management', component: PromotionManagementComponent},
    {path: 'app-profile', component: ProfileComponent}
  
];
