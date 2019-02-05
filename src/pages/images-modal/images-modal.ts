import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-images-modal',
  templateUrl: 'images-modal.html'
})
export class ImagesModalPage {
  
  imagesList:any = [];
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams) {
    this.imagesList = this.navParams.get('message');
   }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

}
