import { Component } from '@angular/core';
import { IonicPage, Loading, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Api } from '../../providers';
@IonicPage()
@Component({
  selector: 'page-payments',
  templateUrl: 'payments.html'
})
export class PaymentsPage {

  bookingDetails: any = {};
  searchCriteria: any = {};
  noRecordFound: boolean = false;
  imgagePath = "https://anytimecheckin.com/new/image/";

  constructor(
    public api: Api,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController
  ) {
    this.bookingDetails = JSON.parse(this.navParams.get("bookingDetails"));
  }
  loading: Loading;
  loadingConfig: any;
  createLoader(message: string = "Please wait...") {
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }
  ionViewDidLoad(){
    this.searchCriteria = JSON.parse(localStorage.getItem('dashboardSearch'));
        
  }


  getBookingDetails() {

    this.createLoader();
    this.noRecordFound = false;
    this.loading.present().then(() => {
      this.api.get(`bookingDetail.php?BookingDetail=ARQP12345&${this.bookingDetails.apiParam}`).subscribe((resp: any) => {
        // this.api.get('hotelDetail.php?hotelDetail=Hotel12345&hotel_id=24').subscribe((resp: any) => {
        //this.api.get('hotelDetail.php?hotelDetail=Hotel12345&hotel_id=hotelDetail=Hotel12345&hotel_id=2').subscribe((resp: any) => {
        this.loading.dismiss();
        if (resp.result == 'success') {


        } else {
          this.noRecordFound = true;
        }
      }, (err) => {
        this.loading.dismiss();
      });
    })
  }

  navigateToBookingConfirmed() {
    this.navCtrl.push('BookingConfirmedPage');
  }

  navigateToPymentsDetails() {
    this.navCtrl.push('PymentsDetailsPage');
  }
}