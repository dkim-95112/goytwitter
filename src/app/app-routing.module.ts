import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home';
import {ResetPasswordComponent} from './reset-password/reset-password.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'password-recovery', component: ResetPasswordComponent},

  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
