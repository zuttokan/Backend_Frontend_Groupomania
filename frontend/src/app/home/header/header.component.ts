import { Component, OnInit } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class headerComponent implements OnInit {
  isAuth$!: Observable<boolean>;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.isAuth$ = this.auth.isAuth$.pipe(shareReplay(1));
  }

  onLogout() {
    console.log('logout');
    this.auth.logout();
  }
}
