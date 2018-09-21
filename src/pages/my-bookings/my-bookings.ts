import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController, Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-my-bookings',
  templateUrl: 'my-bookings.html'
})
export class MyBookingsPage {
  bookingOptionsModel = 'Upcoming';
  
  constructor(public navCtrl: NavController) {}

  navigateToBookingCancelled() {
    this.navCtrl.push('CancelBookingPage');
  }
}
