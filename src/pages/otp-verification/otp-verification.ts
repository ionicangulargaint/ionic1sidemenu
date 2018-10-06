import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { User, Api } from '../../providers';
import * as $ from 'jquery';

@IonicPage()
@Component({
  selector: 'page-otp-verification',
  templateUrl: 'otp-verification.html'
})
export class OtpVerificationPage {

  private paramData: any = {};
  public inputOtp: any = '';
  otpArray:any = ['', '', '', '', '', ''];
  public enableSubmitBtn: boolean = false;
  public isREquestFromEmail: boolean = false;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public api: Api,
    public navParams: NavParams,
    public loadingCtrl: LoadingController) {

    this.paramData = navParams.get('data');
    if (this.paramData.requestFrom == 'EMAILSIGNUP') {
      this.isREquestFromEmail = true;
    } else {
      this.isREquestFromEmail = false;
    }
    var temp = this;
    
    $(function () {
      $(".otp").keyup(function (e: any) {
        if ((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105)) {
          e.target.value = String.fromCharCode(e.which);
          temp.otpArray[Number(e.target.id)] = e.target.value;          
          eventCaller();
          $(e.target).next('.otp').focus();         
        } else if (e.which == 8) {
          e.target.value = String.fromCharCode(e.which);
          temp.otpArray[Number(e.target.id)] = '';          
          eventCaller();
          $(e.target).prev('.otp').focus();          
        }
      });
    });


    function eventCaller() {
      var flag = true;
      for (var i = 0; i <= 6; i++) {
        if (temp.otpArray[i] == '') {
          flag = false;
          temp.enableSubmitBtn = false;
          temp.inputOtp = '';
          return;
        } else {
          flag = true;
        }
        
      }
      if (flag) {
        temp.inputOtp = '';
        temp.otpArray.forEach((item)=>{
          temp.inputOtp = temp.inputOtp + item;
        })
        temp.enableSubmitBtn = true;
      } else {
        temp.inputOtp = '';
        temp.enableSubmitBtn = false;        
      }
    }
    
  }

  loading: Loading;
  loadingConfig: any;
  createLoader(message: string = "Please wait...") {
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }
  verifyEmailOtp() {
    this.createLoader();
    this.loading.present().then(() => {
      let seq = this.api.get('varifyOTP.php?checkByByEmail=AREMAIL12345', { "email": this.paramData.userEmail, 'otp': this.inputOtp }).share();
      seq.subscribe((res: any) => {
        this.loading.dismiss();
        if (res.success == '1') {
          let toast = this.toastCtrl.create({
            message: 'User registration success. Please login.',
            duration: 3000,
            position: 'top'
          });
          toast.present();
          setTimeout(() => {
            this.navCtrl.setRoot('LoginPage');
          }, 3000);

        } else {
          let toast = this.toastCtrl.create({
            message: 'Invalid otp please enter correct otp.',
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.inputOtp = '';
          this.otpArray.forEach(element => {
            element = '';
          });
        }
      }, err => {
        this.loading.dismiss();
        console.error('ERROR', err);
      });
    })
  }

  ionViewDidLoad() {

  }
  backToPage() {
    this.navCtrl.pop();
  }
}
