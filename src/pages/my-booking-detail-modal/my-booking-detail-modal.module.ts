import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { MyBookingDetailModalPage } from './my-booking-detail-modal';

@NgModule({
  declarations: [
    MyBookingDetailModalPage,
  ],
  imports: [
    IonicPageModule.forChild(MyBookingDetailModalPage),
    TranslateModule.forChild()
  ],
  exports: [
    MyBookingDetailModalPage
  ]
})
export class MyBookingDetailModalPageModule { }
