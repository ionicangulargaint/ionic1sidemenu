import { Component } from '@angular/core';
import { ToastController IonicPage, Loading, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Api } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-cancel-booking',
  templateUrl: 'cancel-booking.html'
})
export class CancelBookingPage {
  
  bookingId: any = {};
  hotelImage:any = {};
  termsConditionCheck:boolean = false;
  noRecordFound: boolean = false;
  imgagePath = "https://anytimecheckin.com/new/image/front/";
  bookingDetails:any = {};

  constructor(
    public navParams: NavParams,
    public api: Api,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    ) {
    this.bookingId = this.navParams.get("bookingId");
    this.hotelImage = this.navParams.get("hotel_image");
  }
  loading: Loading;
  loadingConfig: any;
  createLoader(message: string = "Please wait...") {
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }
  ionViewDidLoad(){
    this.getBookingDetails();     
  }
 
  getBookingDetails(){
    this.createLoader();
    this.noRecordFound = false;
    this.loading.present().then(() => {
      let loggedInUserId = (JSON.parse(localStorage.getItem('userDetails'))).user_id;
      this.api.get(`view_detail.php?ViewDetail=ARQP12345&user_id=${loggedInUserId}&booking_id=${this.bookingId}`).subscribe((resp: any) => {
        this.loading.dismiss();
        if (resp) {
          this.bookingDetails = resp;
        } else {
          this.noRecordFound = true;
        }
      }, (err) => {
        this.loading.dismiss();
      });
    })
  }

  cancleHotelBooking(){
    this.createLoader();
    this.noRecordFound = false;
    this.loading.present().then(() => {      
      this.api.get(`cancelBookingbyuser.php?cancelBookingbyuser=CANCEL12345&booking_id=${this.bookingId}`).subscribe((resp: any) => {
        this.loading.dismiss();
        if (resp.result == "success") {          
          let toast = this.toastCtrl.create({
            message: 'Updated successfully',
            duration: 3000,
            position: 'top'
          });
          toast.present();
          setTimeout(()=>{
            this.navCtrl.pop();
          }, 3000)
        } else {
          let toast = this.toastCtrl.create({
            message: 'An server error occured,',
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      }, (err) => {
        this.loading.dismiss();
      });
    })
  }

}
