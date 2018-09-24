import { Component,Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, Events, LoadingController, Loading } from 'ionic-angular';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  //@Output() updateLoginStatus: EventEmitter<any> = new EventEmitter();
  
  loginModel: any = 'email';
  currentCountry:any = {
    code:'',
    number:''
  };
  public loginError: any = {
    show: false,
    msg: ''
  }
  public loginErrorByMobile:any = {
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
    public loadingCtrl: LoadingController) {

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
      this.user.login(data, 'EMAIL').subscribe((resp:any) => {
        this.loading.dismiss();
        if(resp.login == 'failed'){
          this.loginError.show = true;
          this.loginError.msg = 'Wrong email or password.';
        }else {
          this.events.publish('user:loggedin', resp, Date.now());
          this.navCtrl.setRoot('DashboardPage');
        }
        
        //this.updateLoginStatus.emit();
        //this.navCtrl.setRoot('DashboardPage');
              
      }, (err) => {
        // let toast = this.toastCtrl.create({
        //   message: 'Wrong user name or password.',
        //   duration: 3000,
        //   position: 'top'
        // });
        // toast.present();
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
    this.user.login(data, 'MOBILE').subscribe((resp) => {
      //this.updateLoginStatus.emit();
      //this.navCtrl.setRoot('DashboardPage');
      this.events.publish('user:loggedin', resp, Date.now());      
    }, (err) => {
      // let toast = this.toastCtrl.create({
      //   message: 'Wrong user name or password.',
      //   duration: 3000,
      //   position: 'top'
      // });
      // toast.present();
      this.loginError.show = true;
      this.loginError.msg = 'An server error occured.';
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
