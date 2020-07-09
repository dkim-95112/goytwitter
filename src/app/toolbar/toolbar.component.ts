import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {SignupComponent} from "../signup/signup.component";
import {LoginComponent} from "../login";
import {Router} from "@angular/router";
import {UserService} from "../_services";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.less'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  @Output() onSelectTab = new EventEmitter<'login' | 'signup'>();
  userLoginSub: Subscription;
  isLoggedIn: boolean;
  displayName: string;

  constructor(
    private router: Router,
    private userService: UserService,
  ) {
  }
  ngOnInit() {
    this.userLoginSub = this.userService.getLoginAsObservable()
      .subscribe(
        isLoggedIn => {
          this.isLoggedIn = isLoggedIn;
          this.displayName = this.isLoggedIn ?
            this.userService.displayName : '';
        }
      );
  }
  ngOnDestroy() {
    this.userLoginSub.unsubscribe();
  }

  login() {
    this.onSelectTab.emit('login');
    // this.dialog.open(SignupComponent)
    //   .afterClosed().subscribe(result => {
    //   if (result && result.status === 'Success') {
    //     // Automatically open login dialog
    //     this.login();
    //   }
    // });
  }
  signup(){
    this.onSelectTab.emit('signup')
  }
  logout() {
    this.userService.logout();
  }
}
