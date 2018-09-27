import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController, Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-payments',
  templateUrl: 'payments.html'
})
export class PaymentsPage {

  constructor(public navCtrl: NavController) { }

  navigateToBookingConfirmed() {
    this.navCtrl.push('BookingConfirmedPage');
  }
  
  navigateToPymentsDetails() {
    this.navCtrl.push('PymentsDetailsPage');
  } 
}
