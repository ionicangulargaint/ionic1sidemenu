import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GetDirectionsPage } from './get-directions';

@NgModule({
  declarations: [
    GetDirectionsPage,
  ],
  imports: [
    IonicPageModule.forChild(GetDirectionsPage),
    TranslateModule.forChild()
  ],
  providers: [Geolocation],
  exports: [
    GetDirectionsPage
  ]
})
export class GetDirectionsPageModule { }
