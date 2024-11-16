import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User, UserService } from '../../services/user/user.service';
import { PaginateResult } from '../../../paginate-result';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
  users: User[] = [];
  currentUser: User  = { id: '',userName: '', email: '', password: '', phonenumber: '', role: '' }
  newUser: { userName: string, email: string, password: string, phoneNumber: number, role: string } = { userName: '', email: '', password: '', phoneNumber: 0, role: '' };
  newRole: { roleName: string, roleDescription: string } = { roleName: '', roleDescription: '' };


  paginateResult: PaginateResult<User> = {
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0
  };
  filter = '';
  sortBy = '';
  pageIndex = 1;
  pageSize = 20;
  totalPages!: number;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadUsers()
    
  }

  getAll(): void {
    console.log('Fetching all users...');
    this.userService.getAllUsers().subscribe(
      (data: any) => {
        console.log('Raw data fetched:', data);
        if (data && data.$values) {
          this.users = data.$values; // Truy cập vào mảng $values chứa người dùng
          console.log('Users fetched:', this.users);
        } else {
          console.error('Invalid data format:', data);
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  loadUsers() : void{
    this.userService
      .getUsersByPaging(this.filter, this.sortBy, this.pageIndex, this.pageSize)
      .subscribe((response) => {
        this.paginateResult = response;
        this.users = response.items;
        console.log(this.users);
        
      });
  }


  getUserById(userId: string): void {
    this.userService.getUserById(userId).subscribe(
      (user) => {
        this.currentUser = user;
      },
      (error) => {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    );
  }

  createUser(userName: string, email: string, password: string, phoneNumber: number, role: string): void {
    console.log(userName, email, password, role);

    if (!this.newUser.userName || !this.newUser.email || !this.newUser.password) {
      console.error('Dữ liệu người dùng chưa đầy đủ');
      return;
    }

    this.userService.createUser(userName, email, password, phoneNumber, role).subscribe(
      () => {
        console.log('Tạo người dùng thành công');
        this.loadUsers(); // Cập nhật danh sách người dùng nếu cần
      },
      (error) => {
        console.error('Lỗi khi tạo người dùng:', error);
        // Thêm log để xem chi tiết lỗi
        if (error.error && error.error.errors) {
          console.error('Chi tiết lỗi:', error.error.errors);
        }
      }
    );
  }

  assignRole(userId: string, roleName: string) {
    this.userService.assignRole(userId, roleName).subscribe(
      () => {
        console.log('Gán vai trò thành công');
      },
      (error) => {
        console.error('Lỗi khi gán vai trò:', error);
      }
    );
  }

  removeRole(userId: string, roleName: string) {
    this.userService.removeRole(userId, roleName).subscribe(
      () => {
        console.log('Xóa vai trò thành công');
      },
      (error) => {
        console.error('Lỗi khi xóa vai trò:', error);
      }
    );
  }

  createRole() {
    console.log(this.newRole);

    this.userService.createRole(this.newRole.roleName, this.newRole.roleDescription).subscribe(
      () => {
        console.log('Tạo vai trò thành công');
      },
      (error) => {
        console.error('Lỗi khi tạo vai trò:', error);
      }
    );
  }

  deleteRole(roleName: string): void {
    console.log(roleName);
    console.log(this.newRole.roleName);


    this.userService.deleteRole(roleName).subscribe(
      () => {
        console.log('Xóa vai trò thành công');
      },
      (error) => {
        console.error('Lỗi khi xóa vai trò:', error);
      }
    );
  }

  deleteUser(userId: string) {
    this.userService.deleteUser(userId).subscribe(
      () => {
        console.log('Xóa người dùng thành công');
        this.loadUsers();
      },
      (error) => {
        console.error('Lỗi khi xóa người dùng:', error);
      }
    );
  }

  updateUser() {
    console.log(this.currentUser);
    this.userService.updateUser(this.currentUser).subscribe(
      () => {
        console.log('Cập nhật người dùng thành công');
        this.loadUsers();
      },
      (error) => {
        console.error('Lỗi khi cập nhật người dùng:', error);
      }
    );
  }

  openCreateUserModal() {
    const createUserModal = document.getElementById('createUserModal');
    if (createUserModal) {
      const modal = new bootstrap.Modal(createUserModal);
      modal.show();
    }
  }

  openCreateRoleModal() {
    const createRoleModal = document.getElementById('createRoleModal');
    if (createRoleModal) {
      const modal = new bootstrap.Modal(createRoleModal);
      modal.show();
    }
  }

  openUserDetailModal(user: User) {
    this.currentUser = user;
    const userDetailModal = document.getElementById('userDetailModal'); // Sửa ID thành userDetailModal
    if (userDetailModal) {
      const modal = new bootstrap.Modal(userDetailModal);
      modal.show();
    }
  }
}
