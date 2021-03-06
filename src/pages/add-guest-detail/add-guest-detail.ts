import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { CommonService } from '../../providers';

@IonicPage()
@Component({
  selector: 'add-guest-detail',
  templateUrl: 'add-guest-detail.html'
})
export class AddGuestDetailPage {
  guestDetails: any = {
    rooms:0,
    adult: 0,
    children: 0
  };

  constructor(public events: Events,public navCtrl: NavController, navParams: NavParams, public commonService: CommonService) {
    this.guestDetails = navParams.get('guestDetails');
  }

  updateRooms(type) {
    if (type == 'add') {
      if(this.guestDetails.rooms == 9){
        this.guestDetails.rooms = 1;
      } else{
        this.guestDetails.rooms = this.guestDetails.rooms + 1;
      }
      
    } else if(this.guestDetails.rooms > 1) {
      this.guestDetails.rooms = this.guestDetails.rooms - 1;
    }
  }

  updateAdult(type) {
    if (type == 'add') {
      if(this.guestDetails.adult == 9){
        this.guestDetails.adult = 1;
      } else{
        this.guestDetails.adult = this.guestDetails.adult + 1;
      }      
    } else if(this.guestDetails.adult > 1) {
      this.guestDetails.adult = this.guestDetails.adult - 1;
    }
  }

  updateChildren(type) {
    if (type == 'add') {
      if(this.guestDetails.children == 9){
        this.guestDetails.children = 0;
      } else{
        this.guestDetails.children = this.guestDetails.children + 1;
      }      
    } else if(this.guestDetails.children) {
      this.guestDetails.children = this.guestDetails.children - 1;
    }
  }
  
  goToDashboard(){
    this.navCtrl.pop();
  }
  
  ionViewDidLeave(){
    this.events.publish('guest:updateDetail', this.guestDetails, Date.now());
  }
}
