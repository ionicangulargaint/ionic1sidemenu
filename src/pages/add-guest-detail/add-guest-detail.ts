import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Items } from '../../providers';

@IonicPage()
@Component({
  selector: 'add-guest-detail',
  templateUrl: 'add-guest-detail.html'
})
export class AddGuestDetailPage {
  item: any;

  constructor(public navCtrl: NavController, navParams: NavParams, items: Items) {
    //this.item = navParams.get('item') || items.defaultItem;
  }

}
