import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class CommonService {
  
  constructor(
    private alertCtrl: AlertController
  ) { }

  showAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'AnyTime CheckIn',
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }

}
