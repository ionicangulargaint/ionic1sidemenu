import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";

import { User } from '../../providers';
import { MainPage } from '../';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  loginModel: any = 'email';
  currentCountry:any = {
    code:'',
    number:''
  };
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { name: string, email: string, password: string } = {
    name: 'Test Human',
    email: '',
    password: ''
  };

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private httpClient: HttpClient) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
    this.changeCountryCode();
  }

  doSignup() {
    // Attempt to login in through our User service
    this.user.signup(this.account).subscribe((resp) => {
      this.navCtrl.push(MainPage);
    }, (err) => {
      this.navCtrl.push(MainPage);
      // Unable to sign up
      let toast = this.toastCtrl.create({
        message: this.signupErrorString,
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
  navigateToForgotPassword(){
    this.navCtrl.push('ForgotPasswordPage');
  }
}
