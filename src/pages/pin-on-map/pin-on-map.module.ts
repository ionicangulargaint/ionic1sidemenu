import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { pinOnMapPage } from './pin-on-map';

@NgModule({
  declarations: [
    pinOnMapPage,
  ],
  imports: [
    IonicPageModule.forChild(pinOnMapPage),
    TranslateModule.forChild()
  ],
  exports: [
    pinOnMapPage
  ]
})
export class AddGuestDetailPageModule { }
