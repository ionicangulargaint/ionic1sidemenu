import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { AddGuestDetailPage } from './add-guest-detail';

@NgModule({
  declarations: [
    AddGuestDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(AddGuestDetailPage),
    TranslateModule.forChild()
  ],
  exports: [
    AddGuestDetailPage
  ]
})
export class AddGuestDetailPageModule { }
