import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from './_services';
import {User} from './_models';
// Todo: todo
// + Make component for filtering list
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  currentUser: User;
  title = 'goytwitter';

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.userService.currentUserSubject.subscribe(
      x => this.currentUser = x
    );
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
