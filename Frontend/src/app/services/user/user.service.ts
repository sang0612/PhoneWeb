import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginateResult } from '../../../paginate-result';
import { catchError, map } from 'rxjs';


export interface User{
  id : string;
  userName : string;
  email : string;
  password : string;
  phonenumber : string;
  role : string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = 'https://localhost:7189/api/User';
  private readonly apiUrl1 = 'https://localhost:7189/api/Admin';

  constructor(private http : HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/Get-All-Users`);
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/Get-by-id/${userId}`);
  }

  createUser(userName: string, email: string, password: string,phoneNumber: number, role : string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl1}/CreateUser`,{ userName, email, password,phoneNumber ,role });
  }

  assignRole(userId: string, roleName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl1}/AssignRole`, { userId, roleName });
  }

  removeRole(userId: string, roleName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl1}/RemoveRole`, { userId, roleName });
  }

  createRole(roleName: string, roleDescription: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl1}/CreateRole`, { roleName, roleDescription });
  }

  deleteRole(roleName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl1}/DeleteRole`, { roleName });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${userId}`);
  }

  updateUser(user : User): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users-by-admin`,user);
  }

  getUsersByPaging(filter: string = '', sortBy: string = '', pageIndex: number = 1, pageSize: number = 10): Observable<PaginateResult<User>> {
    let params = new HttpParams()
      .set('filter', filter)
      .set('sortBy', sortBy)
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());
  
    return this.http.get<PaginateResult<User>>(`${this.apiUrl}/users/paging`, { params });
  }

  getUserNameById(userId: string): Observable<string> {
    return this.getUserById(userId).pipe(
      map(user => user.userName || 'Unknown User'),
      catchError(err => {
        console.error('Error fetching user:', err);
        return ('Unknown User');
      })
    );
  }

}



