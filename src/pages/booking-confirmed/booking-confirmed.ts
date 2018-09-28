import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-booking-confirmed',
  templateUrl: 'booking-confirmed.html'
})
export class BookingConfirmedPage {
  
  constructor(public navCtrl:NavController) {}

  getDirections(){
    this.navCtrl.push('GetDirectionsPage');
  }

}
