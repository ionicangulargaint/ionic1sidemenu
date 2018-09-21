import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {
  }

  ionViewDidLoad() {

  }

  navigateToForgotPassword(){
    this.navCtrl.push('ForgotPasswordPage');
  }

  editProfile(){
    this.navCtrl.push('EditProfilePage');
  }
  changePassword(){
    this.navCtrl.push('ChangePasswordPage');
  }
  
}
