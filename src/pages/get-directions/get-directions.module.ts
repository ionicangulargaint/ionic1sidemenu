import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { getDirectionsPage } from './get-directions';

@NgModule({
  declarations: [
    getDirectionsPage,
  ],
  imports: [
    IonicPageModule.forChild(getDirectionsPage),
    TranslateModule.forChild()
  ],
  exports: [
    getDirectionsPage
  ]
})
export class getDirectionsPageModule { }
