import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, take, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {
    if (localStorage.getItem('token')) {
      this.auth.isAuth$.next(true);
    }
  }

  // Check the authentification
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    /* Observable return true if the user is valid*/
    return this.auth.isAuth$.pipe(
      take(1),
      tap((auth) => {
        if (!auth) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
