import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from './../../directives/shared.module';

import { HotelDetailPage } from './hotel-detail';

@NgModule({
  declarations: [
    HotelDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(HotelDetailPage),
    TranslateModule.forChild(),
    SharedModule
  ],
  exports: [
    HotelDetailPage
  ]
})
export class HotelDetailPageModule { }
