import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from './../../directives/shared.module';
import { CommonService } from '../../providers';
import { SearchedHotelListPage } from './searched-hotel-list';

@NgModule({
  declarations: [
    SearchedHotelListPage
  ],
  imports: [
    IonicPageModule.forChild(SearchedHotelListPage),
    TranslateModule.forChild(),
    SharedModule
  ],
  providers:[CommonService],
  exports: [
    SearchedHotelListPage
  ]
})
export class SearchedHotelListPageModule { }
