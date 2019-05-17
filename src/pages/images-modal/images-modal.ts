import { Component, ViewChild, OnInit } from '@angular/core';
import { Slides, IonicPage, ViewController, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-images-modal',
  templateUrl: 'images-modal.html'
})
export class ImagesModalPage {
  @ViewChild('slides') slides: Slides;
  imagesList: any = [];
  hidePrev: boolean = true;
  hideNext: boolean = true;
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams) {
    this.imagesList = this.navParams.get('message');
    
  }

  ionViewDidLoad() {
    if(this.imagesList.length <= 1){
      this.hidePrev = false;
      this.hideNext = false;
    } else{
      this.hidePrev = false;
    }
  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

  next() {
    this.slides.slideNext();
    this.showHideSlideButtons();
  }

  prev() {
    this.slides.slidePrev();
    this.showHideSlideButtons();
    
  }

  showHideSlideButtons(){
    let isBegning = this.slides.isBeginning();
    if (isBegning) {
      this.hidePrev = false;
      this.hideNext = true;
    }
    let isEnd = this.slides.isEnd();
    
    if (isEnd) {
      this.hidePrev = true;
      this.hideNext = false;
    }
  }

}
