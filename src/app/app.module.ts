import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import { MatSliderModule } from '@angular/material/slider';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {TweetCardComponent} from './tweet-card/tweet-card.component';
import {TweetListComponent} from './tweet-list/tweet-list.component';
// used to create fake backend
import {fakeBackendInterceptor} from './_helpers';
import {JwtInterceptor, ErrorInterceptor} from './_helpers';
import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {EnterTweetComponent} from './enter-tweet/enter-tweet.component';
import {EnterTweetSearchComponent} from './enter-tweet-search/enter-tweet-search.component';

import {SignupComponent} from './signup/signup.component';

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
    MatToolbarModule
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
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

    // provider used to create fake backend
    //fakeBackendInterceptor
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
