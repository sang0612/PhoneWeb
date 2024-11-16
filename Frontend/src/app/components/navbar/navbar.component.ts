import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { faL, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FontAwesomeModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent{
  faShoppingCart = faShoppingCart;
  faUser = faUser;
  // isAdmin: boolean = false;
  // isCustomer: boolean = false;
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(){
    if (this.authService.isLoggedIn()) {
      this.authService.getRole().subscribe({
        next: (role) => {
          if (role === 'User is in Admin role') {
            // this.isAdmin = true;
            // this.isCustomer = false;
            this.authService._localStorage?.setItem('isAdmin','true');
            this.authService._localStorage?.setItem('isCustomer','false');
            console.log(this.authService._localStorage?.getItem('isAdmin'));
            console.log(this.authService._localStorage?.getItem('isCustomer'));
            console.log(this.authService._localStorage?.getItem('userInformation'));
            
            
          } else if (role === 'User is in Customer role') {
            // this.isCustomer = true;
            // this.isAdmin = false;
            this.authService._localStorage?.setItem('isAdmin','false');
            this.authService._localStorage?.setItem('isCustomer','true');
            console.log(this.authService._localStorage?.getItem('isAdmin'));
            console.log(this.authService._localStorage?.getItem('isCustomer'));
            console.log(this.authService._localStorage?.getItem('userInformation'));
          } else {
            // this.isCustomer = false;
            // this.isAdmin = false;
            this.authService._localStorage?.setItem('isAdmin','false');
            this.authService._localStorage?.setItem('isCustomer','false');
            console.log(this.authService._localStorage?.getItem('isAdmin'));
            console.log(this.authService._localStorage?.getItem('isCustomer'));
            console.log(this.authService._localStorage?.getItem('userInformation'));
          }
        },
        error: (err) => {
          console.error('Error checking role', err);
        }
      });
    }
  }

  setFalse(){
    // this.isAdmin = false;
    // this.isCustomer = false;
    this.authService._localStorage?.setItem('isAdmin','false');
    this.authService._localStorage?.setItem('isCustomer','false');
    this.router.navigate(['']);
  }

  isDropdownOpen: boolean = false;
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

}

