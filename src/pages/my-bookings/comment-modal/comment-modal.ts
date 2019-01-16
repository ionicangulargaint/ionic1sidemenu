import { Component, Output, EventEmitter } from '@angular/core';
import { NavParams, IonicPage, NavController, ToastController, Events, LoadingController, Loading, ViewController } from 'ionic-angular';
import { Api } from './../../../providers';

@IonicPage()
@Component({
  selector: 'comment-modal',
  templateUrl: 'comment-modal.html'
})
export class CommentModalPage {
  public commentParams:any;
  public commentBoxText:any = '';
  public ratings:any;
  constructor(
    public api: Api,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public events: Events
  ) {
    this.commentParams = this.navParams.get("param");
      events.subscribe('star-rating:changed', (starRating) => {
        console.log(starRating)
        this.ratings = starRating;
      });
  }
  loading: Loading;
  loadingConfig: any;
  createLoader(message: string = "Please wait...") {
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  


  doComment() {
    this.createLoader();
    this.loading.present().then(() => {
      let data = {
        commnet_text: this.commentBoxText,
        ratings: this.ratings,
        hotel_id: this.commentParams.hotel_id,
        user_id: this.commentParams.user_id,
        booking_id: this.commentParams.booking_id
      }
      this.api.get(`write_comment.php?WriteaComment=ARQP12345`, data).subscribe((resp: any) => {
        this.loading.dismiss();
        this.closeModal();
        if (resp.result == 'failed') {
          
        } else {         
          
        }
      }, (err) => {       
        this.loading.dismiss();
        this.closeModal();
      });
    })


  }

  ionViewDidLoad() {
    
  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

}
