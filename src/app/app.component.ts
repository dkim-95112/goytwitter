import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from './_services';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';

// Todo: todo
// + Make component for filtering list
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, OnDestroy {
  userLoginSub: Subscription;
  isLoggedIn: boolean;
  title = 'tooter';

  constructor(
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.userLoginSub = this.userService.getLoginAsObservable()
      .subscribe(
        isLoggedIn => this.isLoggedIn = isLoggedIn
      );
  }

  ngOnDestroy() {
    this.userLoginSub.unsubscribe();
  }

  signup() {
    this.dialog.open(SignupComponent);
  }

  login() {
    this.dialog.open(LoginComponent);
  }

  logout() {
    this.userService.logout();
  }
}
