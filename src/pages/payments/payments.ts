import { Component } from '@angular/core';
import { ModalController, IonicPage, Loading, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Api } from '../../providers';
import { InAppBrowser } from '@ionic-native/in-app-browser';
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
  serverBookingPaymentDetails: any = {};
  totalNoOfDays: any;
  userEmailId: any = '';

  constructor(
    public api: Api,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    private inappBrowes: InAppBrowser
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
  ionViewDidLoad() {
    this.getBookingDetails();
    this.searchCriteria = JSON.parse(localStorage.getItem('dashboardSearch'));
    //this.getBookingDetails();            
  }


  getBookingDetails() {

    this.createLoader();
    this.noRecordFound = false;
    this.loading.present().then(() => {
      this.api.get(`bookingDetail.php?BookingDetail=ARQP12345`, this.bookingDetails.apiParam).subscribe((resp: any) => {
        // this.api.get('hotelDetail.php?hotelDetail=Hotel12345&hotel_id=24').subscribe((resp: any) => {
        //this.api.get('hotelDetail.php?hotelDetail=Hotel12345&hotel_id=hotelDetail=Hotel12345&hotel_id=2').subscribe((resp: any) => {
        this.loading.dismiss();
        if (resp.result == 'success') {
          this.serverBookingPaymentDetails = resp.Data;
          if (this.serverBookingPaymentDetails) {
            var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            var firstDate = new Date(this.serverBookingPaymentDetails.check_in_date);
            var secondDate = new Date(this.serverBookingPaymentDetails.check_out_date);

            this.totalNoOfDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
            if (this.totalNoOfDays == 0) {
              this.totalNoOfDays = 1;
            }
          } else {
            this.totalNoOfDays = 1;
          }

        } else {
          this.noRecordFound = true;
        }
      }, (err) => {
        this.loading.dismiss();
      });
    })
  }



  openLoginMOdal() {
    // if(JSON.parse(localStorage.getItem('userDetails'))
    let loggedInUserId = (localStorage.getItem('userDetails'));
    if (loggedInUserId) {
      this.modalChangeStatus('ALREADYLOGIN');
    } else {
      let options = {
        showBackdrop: false,
        cssClass: 'modal-backdrop-bg'
      }
      var data = { message: '', change: this.modalChangeStatus.bind(this) };
      var modalPage = this.modalCtrl.create('LoginAsGuestModalPage', data, options);
      modalPage.present();
    }

  }

  modalChangeStatus(item) {
    let apiParam = {
      hotel_id: this.serverBookingPaymentDetails.hotel_id,
      payment: 1,
      no_of_room: this.serverBookingPaymentDetails.no_of_rooms,
      hotel_room_type_id: this.serverBookingPaymentDetails.hotel_id,
      no_of_person: this.serverBookingPaymentDetails.no_adult,
      no_of_childs: this.serverBookingPaymentDetails.no_child,
      check_in_date: this.serverBookingPaymentDetails.check_in_date,
      check_out_date: this.serverBookingPaymentDetails.check_out_date,
      check_in_time: this.searchCriteria.check_in_time,
      check_out_time: this.searchCriteria.check_out_time,
      booking_type: this.searchCriteria.optradio,
      total_amount: this.serverBookingPaymentDetails.total_amount_payable,
      discount_amount: this.serverBookingPaymentDetails.discount_amount,
      booked_price: this.serverBookingPaymentDetails.total_amount,
      user_id: '',
      fname: '',
      lname: '',
      email: '',
      mob_no: ''
    }

    if (item.type == 'LOGIN') {
      apiParam.user_id = item.data.user_id;
      this.userEmailId = item.data.email;
    } else if (item == 'ALREADYLOGIN') {
      apiParam.user_id = (JSON.parse(localStorage.getItem('userDetails'))).user_id;
      this.userEmailId = (JSON.parse(localStorage.getItem('userDetails'))).email;
    } else {
      apiParam.fname = item.data.fname;
      apiParam.lname = item.data.lname;
      apiParam.email = item.data.email;
      apiParam.mob_no = item.data.mobile;
      this.userEmailId = item.data.email;
    }
    this.confirmBooking(apiParam, item);
  }

  confirmBooking(param, loginType) {
    let userId: any = '';
    let guest: any = {
      fname: '',
      lname: '',
      email: '',
      mob_no: ''
    }
    if (loginType == 'ALREADYLOGIN') {
      userId = JSON.parse(localStorage.getItem('userDetails')).user_id;
    } else {
      userId = '';
      guest.fname = loginType.data.fname;
      guest.lname = loginType.data.lname;
      guest.email = loginType.data.email;
      guest.mob_no = loginType.data.mobile;
    }
    let dateTime = {
      check_in_time: '',
      check_out_time: ''
    }
    if (this.searchCriteria.optradio == 2) {
      dateTime.check_in_time = this.searchCriteria.check_in_time;
      dateTime.check_out_time = this.searchCriteria.check_out_time;
    } else {
      dateTime.check_in_time = '';
      dateTime.check_out_time = '';
    }


    let paramData: any = `https://anytimecheckin.com/new/api/pay-paypal.php?user_id${userId}&optradio${this.searchCriteria.optradio}&check_in_date=${this.serverBookingPaymentDetails.check_in_date}&
    check_out_date=${this.serverBookingPaymentDetails.check_in_date}&
    check_in_time=${dateTime.check_in_time}&
    check_out_time=${dateTime.check_in_time}&
    hotel_id=${this.serverBookingPaymentDetails.hotel_id}&
    hotel_room_type_id=${this.bookingDetails.apiParam.hotel_room_type_id}&
    discounted_price=${this.serverBookingPaymentDetails.discount_amount}&
    childs=${this.serverBookingPaymentDetails.no_child}&
    total_price=${this.serverBookingPaymentDetails.total_amount_payable}&
    noofroom=${this.serverBookingPaymentDetails.no_of_rooms}&
    no_of_person=${this.serverBookingPaymentDetails.no_adult}&
    fname=${guest.fname}&
    lname=${guest.lname}&
    email=${guest.email}&
    mob_no=${guest.mob_no}`;

    // this.api.get(`response_result.php`).subscribe((resp: any) => {
    //   resp;
    // }, (err) => {

    // });

    const browser = this.inappBrowes.create(paramData);

    // let eventSource = window['EventSource'];
    // let source = new EventSource("https://anytimecheckin.com/new/api/response.php");
    // source.onmessage = ((event)=>  {
    //   event.data;
    //   if(event.data == 2){
    //     browser.close();
    //     setTimeout(() => {
    //       this.navigateToBookingConfirmed('s');
    //     }, 200);
    //   }
    // });
    browser.on('loadstop').subscribe(event => {
      browser.insertCSS({ code: "body{color: red;" });
    });
    

    // this.createLoader();
    // this.noRecordFound = false;
    // this.loading.present().then(() => {
    //   this.api.get(`paymentPage.php?paymentPage=ARQP12345`, param).subscribe((resp: any) => {        
    //     this.loading.dismiss();
    //     if (resp.result == 'success') {
    //       this.navigateToBookingConfirmed(resp.transaction_id);
    //     } else {
    //       this.noRecordFound = true;
    //     }
    //   }, (err) => {
    //     this.loading.dismiss();
    //   });
    // })
  }

  navigateToBookingConfirmed(bookingId) {
    this.navCtrl.push('ThankyouPage', { userEmail: this.userEmailId });
  }

  navigateToPymentsDetails() {
    //this.navCtrl.push('PymentsDetailsPage');
  }
}
