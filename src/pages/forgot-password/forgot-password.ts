import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { HttpClient } from "@angular/common/http";

import { User } from '../../providers';
import { MainPage } from '../';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {  
  currentCountry:any = {
    code:'',
    number:''
  };
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: '',
    password: ''
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private httpClient: HttpClient) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  // Attempt to login in through our User service
  doLogin() {
    this.user.login(this.account).subscribe((resp) => {
      this.navCtrl.push(MainPage);
    }, (err) => {
      this.navCtrl.push(MainPage);
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
  changeCountryCode() {
    this.httpClient.get("https://ipinfo.io")
      .subscribe((currentLocationData:any) => {
        this.httpClient.get("assets/staticData/countryCode.json")
          .subscribe((countryList:any) => {
            
            countryList.forEach(element => {
              if(element.code == currentLocationData.country){
                  this.currentCountry.number = element.dial_code;
                  this.currentCountry.code = 'assets/country-flag/' + element.code.toLowerCase() + '.png';             
              }else{

              }
            });
          },
            error => {
              console.log("Error", error);
            }
          );
      },
        error => {
          console.log("Error", error);
        }
      );


  }

  ionViewDidLoad() {
    this.changeCountryCode();
  }

  navigateToOtpVerification(){
 this.navCtrl.push('OtpVerificationPage');
  }
}
