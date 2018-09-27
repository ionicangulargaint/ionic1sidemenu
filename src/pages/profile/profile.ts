import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, LoadingController, Loading  } from 'ionic-angular';
import { User, Api } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  constructor(public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public api:Api,
    public translateService: TranslateService) {  
          
  }
  public profileData:any = {};

  loading: Loading;
  loadingConfig: any;
  createLoader(message: string = "Please wait...") { 
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  ionViewDidLoad() {
this.getUserProfileData();
  }

  getUserProfileData(){
    let userId = localStorage.getItem('user');
    this.createLoader();
    this.loading.present().then(() => {
    let seq = this.api.get('getUserData.php?getUserProfile=ARQP12345', { "userId": userId }).share();
    seq.subscribe((res: any) => {
      this.loading.dismiss();
      if (res.result == "1") {
        this.profileData = res.profile;
      } else {
         let toast = this.toastCtrl.create({
        message: 'An server error occured,',
        duration: 3000,
        position: 'top'
      });
      toast.present();       
      }
    }, err => {
      this.loading.dismiss();
      console.error('ERROR', err);
    });
  })
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
