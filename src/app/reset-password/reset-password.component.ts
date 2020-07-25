import {Component} from "@angular/core";
import {UserService} from "../_services";

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})

export class ResetPasswordComponent {
  constructor(
    private userService: UserService,
  ) {
  }
  edit = {
    email: "",
  };

  onSendResetPasswordEmail() {
    debugger
    this.userService.sendResetPasswordEmail(
      this.edit.email
    ).subscribe(result => {
      debugger
    });
  }
}
