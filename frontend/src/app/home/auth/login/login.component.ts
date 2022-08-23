import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: UntypedFormGroup;
  errorMsg!: string;
  isAdmin!: boolean;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      isAdmin: [],
    });
  }

  onLogin() {
    const email = this.loginForm.get('email')!.value;
    const password = this.loginForm.get('password')!.value;
    const isAdmin = this.loginForm.get('isAdmin')!.value;
    this.auth
      .loginUser(email, password, isAdmin)
      .pipe(
        tap(() => {
          this.router.navigate(['/home']);
        }),
        catchError((error) => {
          this.errorMsg = error.message;
          return EMPTY;
        })
      )
      .subscribe();
  }
}
