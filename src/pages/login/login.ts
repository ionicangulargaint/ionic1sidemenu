import { Component, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, Events, LoadingController, Loading } from 'ionic-angular';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api, User } from '../../providers';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  //@Output() updateLoginStatus: EventEmitter<any> = new EventEmitter();

  loginModel: any = 'email';
  currentCountry: any = {
    code: '',
    number: ''
  };
  public loginError: any = {
    show: false,
    msg: ''
  }
  public loginErrorByMobile: any = {
    show: false,
    msg: ''
  }

  public loginFormByEmail: FormGroup;
  public loginFormByMobile: FormGroup;

  constructor(
    public user: User,
    private _FORMBUILDER: FormBuilder,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public events: Events,
    private httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    private fb: Facebook,
    public api: Api
  ) {

    this.loginFormByEmail = this._FORMBUILDER.group({
      'email': ['', [Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]],
      'password': ['', Validators.required]
    });
    this.loginFormByMobile = this._FORMBUILDER.group({
      'mobile': ['', Validators.required],
      'password': ['', Validators.required]
    })
  }

  // Attempt to login in through our User service
  loading: Loading;
  loadingConfig: any;
  createLoader(message: string = "Please wait...") {
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  doLoginByEmail() {
    this.createLoader();
    this.loading.present().then(() => {
      let data = {
        email: this.loginFormByEmail.controls['email'].value,
        password: this.loginFormByEmail.controls['password'].value
      }
      this.user.login(data, 'EMAIL').subscribe((resp: any) => {
        this.loading.dismiss();
        if (resp.login == 'failed') {
          this.loginError.show = true;
          this.loginError.msg = 'Wrong email or password.';
        } else {
          resp.loginFb = false;
          this.events.publish('user:loggedin', resp, Date.now());
          this.navCtrl.setRoot('DashboardPage');
        }
      }, (err) => {
        this.loginError.show = true;
        this.loginError.msg = 'An server error occured.';
        this.loading.dismiss();
      });
    })
  }

  doLoginByMobile() {
    let data = {
      mobile: this.loginFormByMobile.controls['mobile'].value,
      password: this.loginFormByMobile.controls['password'].value
    }
    this.user.login(data, 'MOBILE').subscribe((resp:any) => {
     // this.loading.dismiss();
      if (resp.login == 'failed') {
        this.loginError.show = true;
        this.loginError.msg = 'Wrong mobile number or password.';
      } else {
        resp.loginFb = false;
        this.events.publish('user:loggedin', resp, Date.now());
        this.navCtrl.setRoot('DashboardPage');
      }
    }, (err) => {
         this.loginError.show = true;
        this.loginError.msg = 'An server error occured.';
        this.loading.dismiss();
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
    this.navCtrl.push('ForgotPasswordPage', {
      'forgotPassword': this.loginModel
    });
  }

  loginWithFacebook() {
    this.fb.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        this.fb.api('me/?fields=id,first_name,last_name,email,picture.width(720).height(720).as(picture_large)',["public_profile","email"]).then( apires => {
          var user = {
            user_id:apires.id,
            email:apires.email,
            first_name:apires.first_name,
            last_name:apires.last_name,
            image:apires.picture_large.data.url,
            loginFb:true
          }
          this.events.publish('user:loggedin', user, Date.now());
          this.api.get(`facebook.php?loginByEmail=FACEBOOK123&email=${user.email}`).subscribe((resp: any) => {
            if (resp.result == 'success') {
              this.navCtrl.setRoot('DashboardPage');
            } 
          }, (err) => {
            this.loginError.show = true;
            this.loginError.msg = 'An server error occured.';
          });
          
        }).catch(err => console.log('Error in profile info', err));
      })
      .catch(e => console.log('Error logging into Facebook', e));

      this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
  }
}
