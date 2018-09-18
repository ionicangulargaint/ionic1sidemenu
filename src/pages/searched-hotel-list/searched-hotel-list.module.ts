import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { SearchedHotelListPage } from './searched-hotel-list';

@NgModule({
  declarations: [
    SearchedHotelListPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchedHotelListPage),
    TranslateModule.forChild()
  ],
  exports: [
    SearchedHotelListPage
  ]
})
export class SearchedHotelListPageModule { }
