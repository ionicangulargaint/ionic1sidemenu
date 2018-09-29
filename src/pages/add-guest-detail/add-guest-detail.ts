import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonService } from '../../providers';

@IonicPage()
@Component({
  selector: 'add-guest-detail',
  templateUrl: 'add-guest-detail.html'
})
export class AddGuestDetailPage {
  guestDetails: any;

  constructor(public navCtrl: NavController, navParams: NavParams, public commonService: CommonService) {
    this.guestDetails = this.commonService.getGuestDetails();
    console.log(this.guestDetails);
  }

  updateRooms(type) {
    if (type == 'add') {
      this.guestDetails.rooms = this.guestDetails.rooms + 1;
    } else if(this.guestDetails.rooms > 1) {
      this.guestDetails.rooms = this.guestDetails.rooms - 1;
    }
    this.updateDetails();
  }

  updateAdult(type) {
    if (type == 'add') {
      this.guestDetails.adult = this.guestDetails.adult + 1;
    } else if(this.guestDetails.adult > 1) {
      this.guestDetails.adult = this.guestDetails.adult - 1;
    }
    this.updateDetails();
  }

  updateChildren(type) {
    if (type == 'add') {
      this.guestDetails.children = this.guestDetails.children + 1;
    } else if(this.guestDetails.children) {
      this.guestDetails.children = this.guestDetails.children - 1;
    }
    this.updateDetails();
    this.guestDetails = this.commonService.getGuestDetails();
    console.log(this.guestDetails);
  }

  updateDetails() {
    this.commonService.setGuestDetails(this.guestDetails.rooms, this.guestDetails.adult, this.guestDetails.children);
  }

  goToDashboard(){
    this.navCtrl.setRoot('DashboardPage');
  }
}
