import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { LoginAsGuestModalPage } from './login-as-guest-modal';

@NgModule({
  declarations: [
    LoginAsGuestModalPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginAsGuestModalPage),
    TranslateModule.forChild()
  ],
  exports: [
    LoginAsGuestModalPage
  ]
})
export class LoginPageModule { }
