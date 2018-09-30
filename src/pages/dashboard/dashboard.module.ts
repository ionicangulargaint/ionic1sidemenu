import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import { TranslateModule } from '@ngx-translate/core';
import { Geolocation } from '@ionic-native/geolocation';
import { CommonService } from '../../providers';
import { DatePicker } from '@ionic-native/date-picker';
import { SharedModule } from './../../directives/shared.module';

@NgModule({
  declarations: [
    DashboardPage
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    TranslateModule.forChild(),
    SharedModule
  ],
  providers: [Geolocation,CommonService, DatePicker],
  exports: [
    DashboardPage
  ]
})
export class DashboardPageModule { }
