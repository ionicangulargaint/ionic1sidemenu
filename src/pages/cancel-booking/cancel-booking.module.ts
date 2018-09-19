import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CancelBookingPage } from './cancel-booking';

@NgModule({
  declarations: [
    CancelBookingPage,
  ],
  imports: [
    IonicPageModule.forChild(CancelBookingPage)
  ],
  exports: [
    CancelBookingPage
  ]
})
export class PaymentsPageModule { }
