import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /*BehaviorSubject send and retrieve values to an Observable*/
  isAuth$ = new BehaviorSubject<boolean>(false); //BehaviorSubject (false) close all the views that require a auth

  private authToken = '';
  private userId = '';
  private userEmail = '';
  private isAdmin!: boolean;

  constructor(private http: HttpClient, private router: Router) {}

  createUser(email: string, password: string, isAdmin: boolean) {
    return this.http.post<{ message: string }>(
      'http://localhost:3000/api/auth/signup',
      { email: email, password: password, isAdmin: isAdmin }
    );
  }

  getToken() {
    return this.authToken;
  }

  getUserId() {
    return this.userId;
  }
  getUserEmail() {
    return this.userEmail;
  }
  getUserAdmin() {
    return this.isAdmin;
  }
  loginUser(email: string, password: string, isAdmin: boolean) {
    return this.http
      .post<{
        userId: string;
        token: string;
        userEmail: string;
        isAdmin: boolean;
      }>('http://localhost:3000/api/auth/login', {
        email: email,
        password: password,
        isAdmin: isAdmin,
      })
      .pipe(
        tap(({ userId, token, userEmail, isAdmin }) => {
          this.isAdmin = isAdmin;
          this.userId = userId;
          this.authToken = token;
          this.isAuth$.next(true);
          this.userEmail = userEmail;
          //console.log(userEmail);

          this.router.navigate(['/home']);
        })
      );
  }

  logout() {
    this.authToken = '';
    this.userId = '';
    this.isAuth$.next(false);
    this.router.navigate(['/login']);
  }
}
