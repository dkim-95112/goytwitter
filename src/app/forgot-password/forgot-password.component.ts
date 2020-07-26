import {Component} from "@angular/core";
import {UserService} from "../_services";

@Component({
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})

export class ForgotPasswordComponent {
  edit = {
    email: "",
  };
  isInProgress = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UserService,
  ) {
  }

  async onSendForgotPasswordEmail() {
    this.isInProgress = true;
    await this.userService.sendForgotPasswordEmail(
      this.edit.email
    ).subscribe(result => {
      this.errorMessage = '';
      this.successMessage = `Email sent to ${
        result.info.accepted.join(', ')
      }.`
    }, error => {
      this.successMessage = '';
      this.errorMessage = error;
    });
    this.isInProgress = false;
  }
}
