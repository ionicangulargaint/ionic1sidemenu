import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Api } from '../../providers';
import { MainPage } from '../';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {
  currentCountry: any = {
    code: '',
    number: ''
  };
  serverResponse: any = {
    msg:'',
    showIcon: false
  };

  public recoverPasswordByEmail: FormGroup;

  constructor(public navCtrl: NavController,
    public api: Api,
    private _FORMBUILDER: FormBuilder,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private httpClient: HttpClient) {
      this.recoverPasswordByEmail = this._FORMBUILDER.group({
        'email': ['', [Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]]
      });
  }

  // Attempt to login in through our User service
  resetPassword(formData) {
    formData;
    this.api.get('forgetpassword.php', {"email" : formData.email}).subscribe((resp:any) => {
      if(resp.status == 1){
        this.serverResponse.msg = resp.result;
        this.serverResponse.showIcon = true;
      }
      //this.navCtrl.push(MainPage);
    }, (err) => {
      //this.navCtrl.push(MainPage);
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: 'Server error',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }


  ionViewDidLoad() {
    // required if mobile forgot support required
    //this.changeCountryCode();
  }

  navigateToLogin() {
    this.navCtrl.setRoot('LoginPage');
  }
  // required if mobile forgot support required
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
}
