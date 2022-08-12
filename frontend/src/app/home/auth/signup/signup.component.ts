import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { catchError, EMPTY, switchMap, tap } from 'rxjs'; // pipe permet de combiner plusieurs fonction à la suite

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: UntypedFormGroup;
  errorMsg!: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }

  onSignup() {
    const email = this.signupForm.get('email')!.value;
    const password = this.signupForm.get('password')!.value;
    this.auth
      .createUser(email, password)
      .pipe(
        switchMap(() => this.auth.loginUser(email, password)), //permet de faire un autre traitement que le retour reçu
        tap(() => {
          // permet de notifier les changements du retour du serveur
          this.router.navigate(['/home']);
        }),
        catchError((error) => {
          this.errorMsg = error.message;
          return EMPTY;
        })
      )
      .subscribe(); // permet de déclencher l'appel au serveur pour effectuer le traitement nécessaire
  }
}
