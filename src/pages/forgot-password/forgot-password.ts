import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api, CommonService} from '../../providers';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {
  forgotPassWith: any;
  currentCountry:any = {
    code:'',
    number:''
  };

  public forgotPassFormByMobile: FormGroup;
  public forgotPassFormByEmail: FormGroup;

  constructor(public navCtrl: NavController,
    public api: Api,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private httpClient: HttpClient,
    public navParams: NavParams,
    private _FORMBUILDER: FormBuilder,
    public loadingCtrl: LoadingController,
    public commonService:CommonService
  ) {
    this.forgotPassWith = navParams.get('forgotPassword');
    this.forgotPassFormByEmail = this._FORMBUILDER.group({
      'email': ['', [Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]]
    });
    this.forgotPassFormByMobile = this._FORMBUILDER.group({
      'mobile': ['', Validators.required]
    })
  }

  loading: Loading;
  loadingConfig: any;
  createLoader(message: string = "Please wait...") { 
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  forgotPasswordWithMobile() {
    let mobile = this.forgotPassFormByMobile.controls['mobile'].value;
    this.createLoader();
    this.loading.present().then(() => {
      this.api.get('forgetpassword.php?ForgetPasswordByMobile=ARMOBILE12345&mobile=' + mobile).subscribe((resp: any) => {
        this.loading.dismiss();
        this.commonService.showAlert(resp.result);
        if(resp.status == '1'){
          console.log('success');
        }        
      }, (err) => {
        this.loading.dismiss();
        let toast = this.toastCtrl.create({
          message: 'Server error',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      });
    })
  }

  forgotPasswordWithEmail() {
    let email = this.forgotPassFormByEmail.controls['email'].value;
    this.createLoader();
    this.loading.present().then(() => {
      this.api.get('forgetpassword.php?ForgetPasswordByEmail=ARQP12345&email=' + email).subscribe((resp: any) => {
        this.loading.dismiss();
        this.commonService.showAlert(resp.result);
        if(resp.status == '1'){
          console.log('success');
        }        
      }, (err) => {
        this.loading.dismiss();
        let toast = this.toastCtrl.create({
          message: 'Server error',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      });
    })
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
}
