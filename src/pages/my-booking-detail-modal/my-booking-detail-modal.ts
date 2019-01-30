import { Component, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavParams, IonicPage, NavController, ToastController, Events, LoadingController, Loading, ViewController } from 'ionic-angular';
import { Api } from '../../providers';

@IonicPage()
@Component({
  selector: 'my-booking-detail-modal',
  templateUrl: 'my-booking-detail-modal.html'
})
export class MyBookingDetailModalPage {
  changeStatus:any;
  noRecordFound: boolean = false;
  bookingDetails:any ={};
  constructor(
    public api: Api,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public events: Events,
    public loadingCtrl: LoadingController,
    private navParams:NavParams
  ) {
    this.changeStatus =  this.navParams.get("change");
    
  }

  // Attempt to login in through our User service
  loading: Loading;
  loadingConfig: any;
  createLoader(message: string = "Please wait...") {
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  getBookingDetails() {
    this.createLoader();
    this.noRecordFound = false;
    this.loading.present().then(() => {
      this.api.get(`bookingConfirmed.php?bookingConfirmed=booking12345&transaction_id=VQZ1014342`).subscribe((resp: any) => {
        //this.api.get(`bookingConfirmed.php?bookingConfirmed=booking12345&transaction_id=${this.bookingId}`).subscribe((resp: any) => {
        this.loading.dismiss();
        this.bookingDetails = resp;
      }, (err) => {
        this.loading.dismiss();
      });
    })


  }

  continueAsGuest() {
    let data = {
      
    }
    this.changeParentStatus('ASGUEST', data);
  }

  ionViewDidLoad() {
    this.getBookingDetails();
  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

  changeParentStatus(type, data) {
    this.viewCtrl.dismiss();
    this.changeStatus({
      type: type,
      data: data
    });
 }

}
