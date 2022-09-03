import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  errorMsg!: string;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      isAdmin: [],
    });
  }

  onSignup() {
    const email = this.signupForm.get('email')!.value;
    const password = this.signupForm.get('password')!.value;
    const isAdmin = this.signupForm.get('isAdmin')!.value;
    this.auth
      .createUser(email, password, isAdmin)
      .pipe(
        switchMap(() => this.auth.loginUser(email, password, isAdmin)),
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
