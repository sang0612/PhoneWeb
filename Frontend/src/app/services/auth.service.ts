import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './user/user.service';

export interface RegisterUser {
  userName: string;
  email: string;
  password: string;
  confirmPassword : string;
  phoneNumber?: string;
}

export interface LoginUser {
  userName: string;
  password: string;
}

export interface ForgotPassword {
  username: string;
  email: string;
}

export interface ResetPassword {
  username: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl:string = "https://localhost:7189/api/User/"
  public _response : any;
  public _localStorage : Storage | undefined;
  private _user : User | undefined;
  constructor(private http : HttpClient) { 
    this._localStorage = document.defaultView?.localStorage;

    if (!this._response) {
      const loginResult: any = this._localStorage?.getItem('loginResult');
      if (loginResult) {
        this._response = JSON.parse(loginResult);
      }
    }
  }

  signUp(userObj:RegisterUser) : Promise<any>{
    return this.http.post<any>(`${this.baseUrl}register`, userObj)
    .toPromise()
      .then((response) => {
        this._response = response;
        this._localStorage?.setItem('loginResult', JSON.stringify(response));
        this._user = JSON.parse(this._response?.userInformation);
        this._localStorage?.setItem(
          'userInformation',
          JSON.stringify(this._user)
        );
        return response;
      })
      .catch((error) => {
        return error;
      });
  }

  login(loginObj: LoginUser) {
    return this.http.post<any>(`${this.baseUrl}login`, loginObj)
      .toPromise()
      .then((response) => {
        this._response = response;
        this._localStorage?.setItem('loginResult', JSON.stringify(response));
        console.log('Login Result Saved:', JSON.stringify(response)); // Thêm dòng này để kiểm tra
        this._user = JSON.parse(this._response?.userInformation);
        this._localStorage?.setItem('userInformation', JSON.stringify(this._user));
        console.log('Login result stored:', response); // Debugging line
        return response;
      })
      .catch((error) => {
        return error;
      });
  }

  // login(loginObj: LoginUser) {
  //   return this.http.post<any>(`${this.baseUrl}login`, loginObj)
  //     .toPromise()
  //     .then((response) => {
  //       // Giả sử 'userId' là thuộc tính tồn tại trong response
  //       const loginResult = {
  //         id: response.userId, // thêm dòng này
  //         token: response.token,
  //         refershToken: response.refershToken,
  //         expires: response.expires,
  //       };
  //       this._localStorage?.setItem('loginResult', JSON.stringify(loginResult));
  //       console.log('Login Result Saved:', JSON.stringify(loginResult)); 
  //       return response;
  //     })
  //     .catch((error) => {
  //       return error;
  //     });
  // }
  

  public isLoggedIn(): boolean {
    return (
      this._response != null &&
      this._response.token != null &&
      this._response.expires != null
    );
  }

  public isAuthenticated() {
    return this.isLoggedIn();
  }

  public getAccessToken(): string {
    return this._response ? this._response.token : '';
  }

  public logout(): boolean {
    this._response = null;
    this._localStorage?.removeItem('loginResult');
    this._localStorage?.removeItem('returnUrl');
    this._localStorage?.removeItem('userInformation');
    this._user = undefined;
    return true;
  }

  public getCurrentUser(): User | undefined {
    const userJSON = this._localStorage?.getItem('userInformation');
    const user: any = userJSON ? JSON.parse(userJSON) : null;
    return user ? user : null;
  }

  public isManager(): boolean {
    const userJSON = this._localStorage?.getItem('userInformation');
    const user: any = userJSON ? JSON.parse(userJSON) : null;
    var result =
      user?.roles.includes('Admin') || user?.roles.includes('Editor');

    return result ? true : false;
  }

  resetPassword(data: ResetPassword): Observable<ResetPassword> {
    return this.http.put<any>(`${this.baseUrl}update-password`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  verifyUser(data: ForgotPassword): Observable<ForgotPassword> {
    let params = new HttpParams().set('username',data.username).set('email', data.email);
    return this.http.get<any>(`${this.baseUrl}verify-user`, {params});
  }

  getRole() : Observable<any>{
    return this.http.get(`${this.baseUrl}check-role`, { responseType: 'text' });
  }

  public getCurrentUserId(): string | undefined {
    const loginResultJSON = this._localStorage?.getItem('loginResult');
    const loginResult: any = loginResultJSON ? JSON.parse(loginResultJSON) : undefined;
    return loginResult ? loginResult.id : undefined;
  }

  public getCurrentUserName(): string | undefined {
    const userJSON = this._localStorage?.getItem('loginResult');
    console.log('Stored userJSON:', userJSON); 
    const user: any = userJSON ? JSON.parse(userJSON) : undefined;
    console.log('Parsed user object:', user); 
    return user?.userName;
  }
  
}