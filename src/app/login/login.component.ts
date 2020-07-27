import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../_services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, OnDestroy {
  @Output() onCloseDrawer = new EventEmitter<null>();
  loginForm: FormGroup;
  isLoading = false;
  submitErrorMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) {
  }

  ngOnDestroy() {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      displayName: ['wanderer', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.submitErrorMessage = '';
    this.userService.login(
      this.loginForm.get('email').value,
      this.loginForm.get('password').value,
    ).subscribe(
      resp => {
        console.log('login comp: %o', resp);
        switch (resp.status) {
          case 'Success':
            this.onCloseDrawer.emit();
            break;
          case 'Failure':
            this.submitErrorMessage = resp.messages.pop();
            break;
        }
      },
      err => {
        console.error('login comp: %o', err);
        this.submitErrorMessage = err;
        this.isLoading = false;
      },
      () => {
        console.log('login comp complete');
        this.isLoading = false;
      }
    );
  }

  emailErrorMessage() {
    if (this.loginForm.get('email')
      .hasError('required')) {
      return 'You must enter a value';
    }
    return this.loginForm.get('email')
      .hasError('email') ? 'Not a valid email' : '';
  }

  passwordErrorMessage() {
    if (this.loginForm.get('password')
      .hasError('required')) {
      return 'You must enter a value';
    }
  }
}
