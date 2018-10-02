import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { SearchedHotelOnmapPage } from './searched-hotel-onmap';
import { CommonService } from '../../providers';

@NgModule({
  declarations: [
    SearchedHotelOnmapPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchedHotelOnmapPage),
    TranslateModule.forChild()
  ],
  providers: [Geolocation,CommonService],
  exports: [
    SearchedHotelOnmapPage
  ]
})
export class SearchedHotelOnmapPageModule { }
