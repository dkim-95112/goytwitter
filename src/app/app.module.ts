import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MatSliderModule } from '@angular/material/slider';
import {MatCardModule} from '@angular/material/card';
import { TweetCardComponent } from './tweet-card/tweet-card.component';
import { TweetListComponent } from './tweet-list/tweet-list.component';

@NgModule({
  declarations: [
    AppComponent,
    TweetCardComponent,
    TweetListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
