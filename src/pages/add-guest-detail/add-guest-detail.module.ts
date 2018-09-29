import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {CommonService } from '../../providers';
import { AddGuestDetailPage } from './add-guest-detail';

@NgModule({
  declarations: [
    AddGuestDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(AddGuestDetailPage),
    TranslateModule.forChild()
  ],
  providers: [CommonService],
  exports: [
    AddGuestDetailPage
  ]
})
export class AddGuestDetailPageModule { }
