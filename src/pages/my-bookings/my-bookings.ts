import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, ToastController, Loading, ModalController } from 'ionic-angular';
import { User, Api } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-my-bookings',
  templateUrl: 'my-bookings.html'
})
export class MyBookingsPage {
  imgagePath = "https://anytimecheckin.com/new/image/front/";
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
    public api: Api,
    public modalCtrl: ModalController) {
    //this.getUpcomingBookingDetails();
  }

  ionViewDidEnter() {
    this.getUpcomingBookingDetails();
  }

  getUpcomingBookingDetails() {
    this.createLoader();
    this.loading.present().then(() => {
      let loggedInUserId = (JSON.parse(localStorage.getItem('userDetails'))).user_id;
      let seq = this.api.get(`upcomingBooking.php?upcomingBooking=UPCOM12345&user_id=${loggedInUserId}`).share();
      seq.subscribe((res: any) => {
        this.loading.dismiss();
        if (res.result == "success") {
          this.upcomingBookingDetail = res.data;
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
      let seq = this.api.get(`completeBooking.php?completeBooking=COMPLE12345&user_id=${loggedInUserId}`).share();
      seq.subscribe((res: any) => {
        this.loading.dismiss();
        if (res.result == "success") {
          this.completedBookingDetail = res.data;
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
      let seq = this.api.get(`cancel_booking.php?cancelBooking=ARQP12345&user_id=${loggedInUserId}`).share();
      seq.subscribe((res: any) => {
        this.loading.dismiss();
        if (res.result == "success") {
          this.cancelledBookingDetail = res.data;
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

  navigateToBookingCancelled(bookingDetails) {
    this.navCtrl.push('CancelBookingPage', { bookingId: bookingDetails.booking_id, hotel_image: bookingDetails.hotel_image_thumb });
  }

  openCommentBox(selectedBooking) {
    let options = {
      showBackdrop: false,
      cssClass: 'modal-backdrop-bg'
    }
    let loggedInUserId = (JSON.parse(localStorage.getItem('userDetails'))).user_id;
    var data = {
      param: {
        hotel_id: selectedBooking.hotel_id,
        user_id: loggedInUserId,
        booking_id: selectedBooking.booking_id,
      }
    };
    var modalPage = this.modalCtrl.create('CommentModalPage', data, options);
    modalPage.present();
  }


  openBookingDetailModal() {
    let options = {
      showBackdrop: false,
      cssClass: 'modal-backdrop-bg'
    }
    var data = { message: '', change: this.modalChangeStatus.bind(this) };
    var modalPage = this.modalCtrl.create('MyBookingDetailModalPage', data, options);
    modalPage.present();
  }

  modalChangeStatus(item) {

  }

}
