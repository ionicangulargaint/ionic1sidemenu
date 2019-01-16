import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { CommentModalPage } from './comment-modal';
import { StarRatingModule } from 'ionic3-star-rating';
import { Autosize } from './autosize';
@NgModule({
  declarations: [
    CommentModalPage,
    Autosize
  ],
  imports: [
    IonicPageModule.forChild(CommentModalPage),
    TranslateModule.forChild(),
    StarRatingModule
  ],
  exports: [
    CommentModalPage
  ]
})
export class LoginPageModule { }
