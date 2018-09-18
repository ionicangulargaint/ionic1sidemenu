import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { HotelDetailPage } from './hotel-detail';

@NgModule({
  declarations: [
    HotelDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(HotelDetailPage),
    TranslateModule.forChild()
  ],
  exports: [
    HotelDetailPage
  ]
})
export class HotelDetailPageModule { }
