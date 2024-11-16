import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../components/navbar/navbar.component";
import { FooterComponent } from "../components/footer/footer.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: any;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    const userId = this.getCurrentUserId();
    console.log('Current User ID:', userId);
    if (userId) {
      this.userService.getUserById(userId).subscribe(data => {
        this.user = data;
      }, error => {
        console.error('Error fetching user data', error);
        console.log(localStorage.getItem('loginResult'));
      });
      

    } else {
      console.error('No user ID found in local storage');
      console.log(localStorage.getItem('loginResult'));
    }
  }
  getCurrentUserId(): string | undefined {
    const loginResultJSON = localStorage.getItem('loginResult');
    const loginResult = loginResultJSON ? JSON.parse(loginResultJSON) : undefined;
    return loginResult ? loginResult.id : undefined;
  }
  
  
}
