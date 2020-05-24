import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from './_services';
import {Subscription} from 'rxjs';
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
    public userService: UserService
  ) {
  }

  ngOnInit() {
    this.userLoginSub = this.userService.getLoginListenerObservable()
      .subscribe(
        isLoggedIn => this.isLoggedIn = isLoggedIn
      );
  }

  ngOnDestroy() {
    this.userLoginSub.unsubscribe();
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
