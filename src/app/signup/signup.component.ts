import {Component, EventEmitter, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UserService} from '../_services';

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.component.html',
  styleUrls: ['signup.component.less'],
})
export class SignupComponent {
  @Output() onCloseDrawer = new EventEmitter<null>();
  submitErrorMessages: string[];
  isLoading: boolean;

  constructor(
    private userService: UserService,
  ) {
  }

  onSubmit(signupForm: NgForm) {
    console.log('onSubmit: %o', signupForm);
    this.submitErrorMessages = [];
    this.isLoading = true;
    this.userService.signup(
      signupForm.value.displayName,
      signupForm.value.email,
      signupForm.value.password,
    ).subscribe(
      resp => {
        console.log('onSubmit %o', resp);
        switch (resp.status) {
          case 'Success':
            // this.dialogRef.close({
            //   status: 'Success'
            // });
            break;
          case 'Failure':
            this.submitErrorMessages = resp.messages;
        }
      },
      err => {
        console.error('onSubmit %o', err);
        this.isLoading = false;
      },
      () => {
        console.log('onSubmit completed');
        this.isLoading = false;
      }
    );
  }
}
