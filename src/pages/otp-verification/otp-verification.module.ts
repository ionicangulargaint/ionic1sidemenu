import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { OtpVerificationPage } from './otp-verification';

@NgModule({
  declarations: [
    OtpVerificationPage,
  ],
  imports: [
    IonicPageModule.forChild(OtpVerificationPage),
    TranslateModule.forChild()
  ],
  exports: [
    OtpVerificationPage
  ]
})
export class ForgotPasswordPageModule { }
