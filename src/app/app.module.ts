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
import {MatDrawer, MatSidenavModule} from "@angular/material/sidenav";
import {AppComponent} from './app.component';
import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {JwtInterceptor, ErrorInterceptor} from './_helpers';
import {AppRoutingModule} from './app-routing.module';
import {TootCardComponent} from './toot-card/toot-card.component';
import {TootListComponent} from './toot-list/toot-list.component';
import {EnterTootComponent} from './enter-toot/enter-toot.component';
import {EnterTootSearchComponent} from './enter-toot-search/enter-toot-search.component';
import {SignupComponent} from './signup/signup.component';
// import {fakeBackendInterceptor} from './_helpers';
import {ErrorDialogComponent} from './error-dialog/error-dialog.component';
import {DeleteDialogComponent} from './delete-dialog/delete-dialog.component';
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {MatTabsModule} from "@angular/material/tabs";

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
    MatSidenavModule,
    MatTabsModule,
  ],
  declarations: [
    AppComponent,
    TootCardComponent,
    TootListComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    EnterTootComponent,
    EnterTootSearchComponent,
    ErrorDialogComponent,
    DeleteDialogComponent,
    ToolbarComponent,
  ],
  providers: [
    {
      provide: MatDrawer,
    },
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
