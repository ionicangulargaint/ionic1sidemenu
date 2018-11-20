import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-payments',
  templateUrl: 'payments.html'
})
export class PaymentsPage {

  bookingDetails:any ={};
  searchCriteria: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.searchCriteria = JSON.parse(localStorage.getItem('dashboardSearch'));
    this.bookingDetails = JSON.parse(navParams.get("bookingDetails"));
   }

  navigateToBookingConfirmed() {
    this.navCtrl.push('BookingConfirmedPage');
  }
  
  navigateToPymentsDetails() {
    this.navCtrl.push('PymentsDetailsPage');
  } 
}
