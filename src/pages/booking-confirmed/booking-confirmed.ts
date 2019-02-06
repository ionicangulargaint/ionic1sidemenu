import { Component } from '@angular/core';
import { ModalController, IonicPage, Loading, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Api } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-booking-confirmed',
  templateUrl: 'booking-confirmed.html'
})
export class BookingConfirmedPage {

  imgagePath = "https://anytimecheckin.com/new/image/";
  bookingDetails: any = {};
  bookingId: any;
  noRecordFound: boolean = false;
  hotelDetails:any;
  constructor(
    public api: Api,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController
  ) {
    this.bookingId = this.navParams.get("booking_id");
    this.hotelDetails = this.navParams.get("hotelDetails");
  }
  loading: Loading;
  loadingConfig: any;
  createLoader(message: string = "Please wait...") {
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  getDirections() {
    this.navCtrl.push('GetDirectionsPage', {hotelDetails: this.hotelDetails});
  }
  ionViewDidLoad() {
    this.getBookingDetails();
  }

  getBookingDetails() {
    this.createLoader();
    this.noRecordFound = false;
    this.loading.present().then(() => {
     // this.api.get(`bookingConfirmed.php?bookingConfirmed=booking12345&transaction_id=VQZ1014342`).subscribe((resp: any) => {
        this.api.get(`bookingConfirmed.php?bookingConfirmed=booking12345&transaction_id=${this.bookingId}`).subscribe((resp: any) => {
        this.loading.dismiss();
        this.bookingDetails = resp;
      }, (err) => {
        this.loading.dismiss();
      });
    })
  }

  backToHome(){
   // this.navCtrl.popToRoot();
   this.navCtrl.push('ThankyouPage');
  }

}
