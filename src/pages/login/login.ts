import { Component,Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
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

  public form: FormGroup;
  constructor(
    public user: User,
    private _FORMBUILDER: FormBuilder,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private httpClient: HttpClient) {

    this.form = this._FORMBUILDER.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  // Attempt to login in through our User service
  doLogin() {
    let data = {
      email: this.form.controls['username'].value,
      password: this.form.controls['password'].value
    }
    this.user.login(data).subscribe((resp) => {
      //this.updateLoginStatus.emit();
      this.navCtrl.push('DashboardPage');
    }, (err) => {
      let toast = this.toastCtrl.create({
        message: 'Wrong user name or password.',
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
