import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ImagesModalPage } from './images-modal';
//import { Facebook } from '@ionic-native/facebook';

@NgModule({
  declarations: [
    ImagesModalPage,
  ],
  //providers:[Facebook],
  imports: [
    IonicPageModule.forChild(ImagesModalPage),
    TranslateModule.forChild()
  ],
  exports: [
    ImagesModalPage
  ]
})
export class LoginPageModule { }
