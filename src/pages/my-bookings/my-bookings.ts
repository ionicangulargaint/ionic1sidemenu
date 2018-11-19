import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, ToastController, Loading } from 'ionic-angular';
import { User, Api } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-my-bookings',
  templateUrl: 'my-bookings.html'
})
export class MyBookingsPage {
  imgagePath = "https://anytimecheckin.com/new/image/";
  loading: Loading;
  loadingConfig: any;
  createLoader(message: string = "Please wait...") {
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  upcomingBookingDetail: any = [];
  completedBookingDetail: any = [];
  cancelledBookingDetail: any = [];
  bookingOptionsModel = 'Upcoming';

  constructor(public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public api: Api, ) {
    //this.getUpcomingBookingDetails();
  }

  ionViewDidEnter() {
    this.getUpcomingBookingDetails();
  }

  getUpcomingBookingDetails() {
    this.createLoader();
    this.loading.present().then(() => {
      let loggedInUserId = (JSON.parse(localStorage.getItem('userDetails'))).user_id;
      let seq = this.api.post('mybooking.php?MyBooking=ARQP12345&userId=49', '').share();
      seq.subscribe((res: any) => {
        this.loading.dismiss();
        if (res.result == "success") {
          this.upcomingBookingDetail = res.UpcomingData;
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

  getCompletedBookingDetails() {
    this.createLoader();
    this.loading.present().then(() => {
      let loggedInUserId = (JSON.parse(localStorage.getItem('userDetails'))).user_id;
      let seq = this.api.post('mybooking.php?MyBooking=AREMAIL12345&userId=49', '').share();
      seq.subscribe((res: any) => {
        this.loading.dismiss();
        if (res.result == "success") {
          this.completedBookingDetail = res['Upcoming Data'];
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

  getCancelledBookingDetails() {
    this.createLoader();
    this.loading.present().then(() => {
      let loggedInUserId = (JSON.parse(localStorage.getItem('userDetails'))).user_id;
      let seq = this.api.post('mybooking.php?MyBooking=ARRP12345&userId=49', '').share();
      seq.subscribe((res: any) => {
        this.loading.dismiss();
        if (res.result == "success") {
          this.cancelledBookingDetail = res.CancelData;
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

  navigateToBookingCancelled() {
    this.navCtrl.push('CancelBookingPage');
  }
}
