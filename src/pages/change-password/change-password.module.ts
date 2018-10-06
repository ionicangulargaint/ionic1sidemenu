import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { CommonService} from '../../providers';
import { ChangePasswordPage } from './change-password';

@NgModule({
  declarations: [
    ChangePasswordPage,
  ],
  providers:[CommonService],
  imports: [
    IonicPageModule.forChild(ChangePasswordPage),
    TranslateModule.forChild()
  ],
  exports: [
    ChangePasswordPage
  ]
})
export class ProfilePageModule { }
