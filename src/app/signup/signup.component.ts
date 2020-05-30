import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {UserService} from '../_services';

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.component.html',
  styleUrls: ['signup.component.less'],
})
export class SignupComponent {
  submitErrorMessage: string;
  isLoading: boolean;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {
  }

  onSubmit(signupForm: NgForm) {
    console.log('onSubmit: %o', signupForm);
    this.submitErrorMessage = '';
    this.isLoading = true;
    this.userService.signup(
      signupForm.value.email,
      signupForm.value.password,
    ).subscribe(
      resp => {
        console.log('onSubmit %o', resp);
        this.router.navigate(['/login']);
      },
      err => {
        console.error('onSubmit %o', err);
        this.submitErrorMessage = err;
        this.isLoading = false;
      },
      () => {
        console.log('onSubmit completed');
        this.isLoading = false;
      }
    );
  }
}
