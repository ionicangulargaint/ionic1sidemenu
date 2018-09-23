import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  public signUpError: any = {
    show: false,
    msg: ''
  }
  public SignUpErrorByMobile:any = {
    show: false,
    msg: ''
  }
  public signUpFormByEmail: FormGroup;
  public signUpFormByMobile: FormGroup;

  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    private _FORMBUILDER: FormBuilder,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private httpClient: HttpClient) {
      this.signUpFormByEmail = this._FORMBUILDER.group({
        'email': ['', Validators.required],
        'password': ['', Validators.required],
        'firstName': ['', Validators.required],
        'lastName': ['', Validators.required]
      });
      this.signUpFormByMobile = this._FORMBUILDER.group({
        'mobile': ['', Validators.required],
        'password': ['', Validators.required],
        'firstName': ['', Validators.required],
        'lastName': ['', Validators.required]
      })
    this.changeCountryCode();
  }

  doSignupByEmail() {
    let data = {
      userName: this.signUpFormByEmail.controls['firstName'].value,
      lastName: this.signUpFormByEmail.controls['lastName'].value,
      userEmail: this.signUpFormByEmail.controls['email'].value,
      password: this.signUpFormByEmail.controls['password'].value,
      //{"userName": "Taru","lastName": "Kumar","userEmail": "taru@netmaxims.com","password": "nitish","signupbyemail": "ARQP12345","checkbox": 0}
    }
    this.user.signup(data, 'EMAIL').subscribe((resp) => {
      //this.updateLoginStatus.emit();
      //this.navCtrl.setRoot('DashboardPage');
      //this.events.publish('user:loggedin', resp, Date.now());      
    }, (err) => {
      // let toast = this.toastCtrl.create({
      //   message: 'Wrong user name or password.',
      //   duration: 3000,
      //   position: 'top'
      // });
      // toast.present();
      this.signUpError.show = true;
      this.signUpError.msg = 'An server error occured.';
    });
  }

  doSignupByMobile() {
    // Attempt to login in through our User service
    this.user.signup('', 'MOBILE').subscribe((resp) => {
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
