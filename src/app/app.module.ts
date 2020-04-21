import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import { MatSliderModule } from '@angular/material/slider';
import {MatCardModule} from '@angular/material/card';
import {AppComponent} from './app.component';
import {TweetCardComponent} from './tweet-card/tweet-card.component';
import {TweetListComponent} from './tweet-list/tweet-list.component';
// used to create fake backend
import { FakeBackendInterceptor } from './_helpers';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home/home.component';
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    HttpClientModule
  ],
  declarations: [
    AppComponent,
    TweetCardComponent,
    TweetListComponent,
    HomeComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    FakeBackendInterceptor
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
