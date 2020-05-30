import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {AppComponent} from './app.component';
import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {JwtInterceptor, ErrorInterceptor} from './_helpers';
import {AppRoutingModule} from './app-routing.module';
import {TweetCardComponent} from './tweet-card/tweet-card.component';
import {TweetListComponent} from './tweet-list/tweet-list.component';
import {EnterTweetComponent} from './enter-tweet/enter-tweet.component';
import {EnterTweetSearchComponent} from './enter-tweet-search/enter-tweet-search.component';
import {SignupComponent} from './signup/signup.component';
// import {fakeBackendInterceptor} from './_helpers';
import {ErrorDialogComponent} from './error-dialog/error-dialog.component';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    MatTabsModule,
  ],
  declarations: [
    AppComponent,
    TweetCardComponent,
    TweetListComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    EnterTweetComponent,
    EnterTweetSearchComponent,
    ErrorDialogComponent,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
