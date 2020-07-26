import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {valueMatchingValidator} from '../_helpers/value-matching.directive';

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

  ngOnInit() {
    this.resetPasswordForm = new FormGroup({
      'newPassword': new FormControl(this.edit.newPassword, [
        Validators.required,
        Validators.minLength(6),
      ]),
      'newPasswordAgain': new FormControl(this.edit.newPasswordAgain, [
        valueMatchingValidator(
          () => this.newPassword && this.newPassword.value
        )
      ])
    })
  }

  get newPassword() {
    // Not available until form is created
    return this.resetPasswordForm && this.resetPasswordForm.get('newPassword')
  }

  get newPasswordAgain() {
    return this.resetPasswordForm.get('newPasswordAgain')
  }
}
