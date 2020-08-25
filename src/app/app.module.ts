import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import {AppComponent} from './app.component';
import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {ErrorInterceptor} from './_helpers/error.interceptor';
import {AppRoutingModule} from './app-routing.module';
import {TootCardComponent} from './toot-card/toot-card.component';
import {TootListComponent} from './toot-list/toot-list.component';
import {EnterTootComponent} from './enter-toot/enter-toot.component';
import {EnterTootSearchComponent} from './enter-toot-search/enter-toot-search.component';
import {SignupComponent} from './signup/signup.component';
import {ErrorDialogComponent} from './error-dialog/error-dialog.component';
import {DeleteDialogComponent} from './delete-dialog/delete-dialog.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {ValueMatchingDirective} from './_helpers/value-matching.directive';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    MatSidenavModule,
    MatTabsModule,
  ],
  declarations: [
    AppComponent,
    DeleteDialogComponent,
    EnterTootComponent,
    EnterTootSearchComponent,
    ErrorDialogComponent,
    HomeComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ValueMatchingDirective,
    SignupComponent,
    ToolbarComponent,
    TootCardComponent,
    TootListComponent,
  ],
  providers: [
    {
      provide: MatDrawer,
      useValue: undefined // From upgrading ng cli 9 to 10
    },
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
