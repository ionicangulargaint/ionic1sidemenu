import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { pinOnMapPage } from './pin-on-map';
import { CommonService } from '../../providers';

@NgModule({
  declarations: [
    pinOnMapPage,
  ],
  imports: [
    IonicPageModule.forChild(pinOnMapPage),
    TranslateModule.forChild()
  ],
  providers: [Geolocation,CommonService],
  exports: [
    pinOnMapPage
  ]
})
export class pinOnMapPageModule { }
