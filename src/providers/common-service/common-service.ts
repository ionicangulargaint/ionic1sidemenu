import { Injectable } from '@angular/core';
import { AlertController, LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class CommonService {
  loading: Loading;
  
  constructor(
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) { }

  showAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'AnyTime CheckIn',
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  createLoader(message: string = "Please wait...") { 
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

}
