import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {valueMatchingValidator} from '../_helpers/value-matching.directive';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../_services';

@Component({
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  edit = {
    newPassword: '',
    newPasswordAgain: '',
  };
  queryToken: string;
  resultMessage = '';

  constructor(
    private router: ActivatedRoute,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.resetPasswordForm = new FormGroup({
      newPassword: new FormControl(this.edit.newPassword, [
        Validators.required,
        Validators.minLength(6),
      ]),
      newPasswordAgain: new FormControl(this.edit.newPasswordAgain, [
        valueMatchingValidator(
          () => this.newPassword && this.newPassword.value
        )
      ])
    });
    this.router.queryParamMap.subscribe(queryParamMap => {
      this.queryToken = queryParamMap.get('tok');
    });
  }

  resetPassword() {
    this.userService.resetPassword(
      this.queryToken,
      this.newPassword.value,
    ).subscribe(result => {
      this.resultMessage = result.message;
    });
  }

  get newPassword() {
    // Not available until form is created
    return this.resetPasswordForm && this.resetPasswordForm.get('newPassword');
  }

  get newPasswordAgain() {
    return this.resetPasswordForm.get('newPasswordAgain');
  }
}
