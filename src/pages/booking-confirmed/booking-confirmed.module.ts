import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookingConfirmedPage } from './booking-confirmed';

@NgModule({
  declarations: [
    BookingConfirmedPage,
  ],
  imports: [
    IonicPageModule.forChild(BookingConfirmedPage)
  ],
  exports: [
    BookingConfirmedPage
  ]
})
export class PaymentsPageModule { }
