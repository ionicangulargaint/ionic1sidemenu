import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, LoadingController, Loading, Events } from 'ionic-angular';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User, Api } from '../../providers';
import { MainPage } from '../';
//import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  loginModel: any = 'email';
  currentCountry: any = {
    code: '',
    number: ''
  };
  public signUpError: any = {
    show: false,
    msg: ''
  }
  public SignUpErrorByMobile: any = {
    show: false,
    msg: ''
  }
  public signUpFormByEmail: FormGroup;
  public signUpFormByMobile: FormGroup;
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    private _FORMBUILDER: FormBuilder,
    public user: User,
    public api: Api,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    //private fb: Facebook,
    public events: Events
    ) {
    this.signUpFormByEmail = this._FORMBUILDER.group({
      'email':  ['', [Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]],
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

  loading: Loading;
  loadingConfig: any;
  createLoader(message: string = "Please wait...") { 
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }


  doSignupByEmail() {
    this.createLoader();
    this.loading.present().then(() => {
    let seq = this.api.get('checkUser.php?checkByEmail=ARQP12345', { "email": this.signUpFormByEmail.controls['email'].value }).share();
    seq.subscribe((res: any) => {
      this.loading.dismiss();
      if (res != this.signUpFormByEmail.controls['email'].value) {
        this.proceedForEmailSignUp();
      } else {
        //this.proceedForEmailSignUp();
        this.showError(true, 'E-mail ' + res + ' already exist.');
      }
    }, err => {
      console.error('ERROR', err);
      this.loading.dismiss();
    });
  })
  }

  proceedForEmailSignUp(){
    this.createLoader();
    this.loading.present().then(() => {
    let data = {
      userName: this.signUpFormByEmail.controls['firstName'].value,
      lastName: this.signUpFormByEmail.controls['lastName'].value,
      userEmail: this.signUpFormByEmail.controls['email'].value,
      password: this.signUpFormByEmail.controls['password'].value,
    }
    this.user.signup(data, 'EMAIL').subscribe((resp: any) => {
      this.loading.dismiss();
      if (resp.result == 'success') {
      //  if ('true' == 'true') {  
      let paramData: any = data;
        paramData.otp = resp.otp;
        //paramData.otp = '123456';
        paramData.requestFrom = 'EMAILSIGNUP';
        this.navCtrl.push('OtpVerificationPage', { data: paramData });
      } else {
        this.showError(true, 'An server error occured.');
      }
      //this.updateLoginStatus.emit();
      //this.navCtrl.setRoot('DashboardPage');
      //this.events.publish('user:loggedin', resp, Date.now());      
    }, (err) => {
      this.showError(true, 'An server error occured.');
      this.loading.dismiss();
    });
  })
  }

  doSignupByMobile() {
    // Attempt to login in through our User service
    this.createLoader();
    this.loading.present().then(() => {
    let data = {
      userName: this.signUpFormByMobile.controls['firstName'].value,
      lastName: this.signUpFormByMobile.controls['lastName'].value,
      mobno: this.signUpFormByMobile.controls['mobile'].value,
      password: this.signUpFormByMobile.controls['password'].value,
    }
    this.user.signup(data, 'MOBILE').subscribe((resp:any) => {
      this.loading.dismiss();
      if (resp.success == '1') {
        let paramData: any = data;
        paramData.requestFrom = 'MOBILESIGNUP';
        this.navCtrl.push('OtpVerificationPage', { data: paramData });
      } else {
        this.showError(true, 'An server error occured.');
      }
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
  });
  }

  changeCountryCode() {
    this.httpClient.get("https://ipinfo.io")
      .subscribe((currentLocationData: any) => {
        this.httpClient.get("assets/staticData/countryCode.json")
          .subscribe((countryList: any) => {

            countryList.forEach(element => {
              if (element.code == currentLocationData.country) {
                this.currentCountry.number = element.dial_code;
                this.currentCountry.code = 'assets/country-flag/' + element.code.toLowerCase() + '.png';
              } else {

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

  navigateToForgotPassword() {
    this.navCtrl.push('ForgotPasswordPage');
  }

  showError(show, msg) {
    this.signUpError.show = show;
    this.signUpError.msg = msg;
  }

  loginWithFacebook() {
    // this.fb.login(['public_profile', 'email'])
    //   .then((res: FacebookLoginResponse) => {
    //     this.fb.api('me/?fields=id,first_name,last_name,email,picture.width(720).height(720).as(picture_large)',["public_profile","email"]).then( apires => {
    //       var user = {
    //         user_id:apires.id,
    //         email:apires.email,
    //         first_name:apires.first_name,
    //         last_name:apires.last_name,
    //         image:apires.picture_large.data.url,
    //         loginFb:true
    //       }
    //       this.events.publish('user:loggedin', user, Date.now());
    //       this.navCtrl.setRoot('DashboardPage');
    //     }).catch(err => console.log('Error in profile info', err));
    //   })
    //   .catch(e => console.log('Error logging into Facebook', e));
    //   this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
  }
}
