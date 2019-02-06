import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ThankyouPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-thankyou',
  templateUrl: 'thankyou.html',
})
export class ThankyouPage {

  useremailId:any = '';

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.useremailId = this.navParams.get("userEmail");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ThankyouPage');
  }

  backToHome(){
    this.navCtrl.popToRoot();
  }

}
