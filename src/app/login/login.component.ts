import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {UserService} from '../_services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  isSubmitted = false;
  returnUrl: string;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    // redirect to home if already logged in
    if (this.userService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['test', Validators.required],
      password: ['test', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.userService.login(
      this.f.email.value, this.f.password.value
    )
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = error;
          this.isLoading = false;
        });
  }

  getEmailErrorMessage() {
    if (this.loginForm.controls.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.loginForm.controls.email
      .hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordErrorMessage() {
    if (this.loginForm.controls.password
      .hasError('required')) {
      return 'You must enter a value';
    }
  }
}
