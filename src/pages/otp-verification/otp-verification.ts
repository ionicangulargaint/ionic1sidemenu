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

  private paramData: any;
  public inputOtp: any = '';
  public enableSubmitBtn: boolean = false;
  public isREquestFromEmail: boolean = false;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public api:Api,
    public navParams: NavParams,
    public loadingCtrl: LoadingController) {

    this.paramData = navParams.get('data');
    if (this.paramData.requestFrom == 'EMAILSIGNUP') {
      this.isREquestFromEmail = true;
    } else {
      this.isREquestFromEmail = false;
    }
    $(function () {
      $(".otp").keyup(function (e: any) {
        if ((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105)) {
          e.target.value = String.fromCharCode(e.which);
          eventCaller(e.target.value);
          $(e.target).next('.otp').focus();
          //var data = String.fromCharCode( e.which );
        } else if (e.which == 8) {
          e.target.value = String.fromCharCode(e.which);
          $(e.target).prev('.otp').focus();
        }
      });
    });
    var temp = this;
    function eventCaller(data) {
      temp.inputOtp = temp.inputOtp + data;
      if (temp.inputOtp.length == 6) {
        temp.enableSubmitBtn = true;
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
  verifyEmailOtp(){
    this.createLoader();
    this.loading.present().then(() => {
    let seq = this.api.get('varifyOTP.php?checkByByEmail=AREMAIL12345', { "email": this.paramData.email, 'otp': this.paramData.otp }).share();
    seq.subscribe((res: any) => {
      this.loading.dismiss();
      if (res.result == 'success') {
        this.navCtrl.setRoot('DashboardPage');
      } else {
         let toast = this.toastCtrl.create({
        message: 'An server error occured,',
        duration: 3000,
        position: 'top'
      });
      toast.present();       
      }
    }, err => {
      this.loading.dismiss();
      console.error('ERROR', err);
    });
  })
  }

  ionViewDidLoad() {

  }
  backToPage(){
    this.navCtrl.pop();
  }
}
