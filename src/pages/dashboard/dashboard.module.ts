import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import { TranslateModule } from '@ngx-translate/core';
import { Geolocation } from '@ionic-native/geolocation';
import { CommonService } from '../../providers';

@NgModule({
  declarations: [
    DashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    TranslateModule.forChild()
  ],
  providers: [Geolocation,CommonService],
  exports: [
    DashboardPage
  ]
})
export class DashboardPageModule { }
