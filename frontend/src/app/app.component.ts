import { Component } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { AuthService } from './home/services/auth.service';


//Decorator that marks a class as an Angular component
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

//class statement that includes the code for the component
export class AppComponent {
  title = 'angular-material-app';
  isAuth$!: Observable<boolean>;

// inject the AuthService
  constructor(private auth: AuthService) {}

// callback method to handle any additional initialization tasks before any of the view or content children have been checked
  ngOnInit() {
    this.isAuth$ = this.auth.isAuth$.pipe(shareReplay(1));
  }
}
//shareReplay redistribute recent results if requested in other component
