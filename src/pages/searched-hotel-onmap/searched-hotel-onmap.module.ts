import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { SearchedHotelOnmapPage } from './searched-hotel-onmap';

@NgModule({
  declarations: [
    SearchedHotelOnmapPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchedHotelOnmapPage),
    TranslateModule.forChild()
  ],
  exports: [
    SearchedHotelOnmapPage
  ]
})
export class SearchedHotelOnmapPageModule { }
