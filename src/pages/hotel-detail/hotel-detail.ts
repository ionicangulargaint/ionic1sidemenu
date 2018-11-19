import { Component } from '@angular/core';
import { ModalController, IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Api } from '../../providers';
import { ArrayType } from '@angular/compiler/src/output/output_ast';

@IonicPage()
@Component({
  selector: 'page-hotel-detail',
  templateUrl: 'hotel-detail.html'
})
export class HotelDetailPage {
  imgagePath = "https://anytimecheckin.com/new/image/";
  selectedHotel: any = '';
  hotelInfo:any;
  hotelImagesList:any = [];
  noRecordFound:boolean = false;

  constructor(
    public api: Api, 
    public loadingCtrl: LoadingController, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl : ModalController
    ) {
    this.selectedHotel = navParams.get('item');
   }
   loading: Loading;
   loadingConfig: any;
   createLoader(message: string = "Please wait...") {
     this.loading = this.loadingCtrl.create({
       content: message
     });
   }

   ionViewDidLoad() {
    this.getHotelDetail();
  } 

  navigateToPaymentsPage() {
    this.navCtrl.push('PaymentsPage'); 
  }

  getHotelDetail() {
    this.createLoader();
    this.noRecordFound = false;
    this.loading.present().then(() => {
      //this.api.get('hotelDetail.php?hotelDetail=Hotel12345&hotel_id=' + this.selectedHotel).subscribe((resp: any) => {
        this.api.get('hotelDetail.php?hotelDetail=Hotel12345&hotel_id=hotelDetail=Hotel12345&hotel_id=5').subscribe((resp: any) => {
        this.loading.dismiss();
        if(resp.result == 'success'){
          this.hotelInfo = resp;
          if(this.hotelInfo.hotelimage){
            this.hotelInfo.hotelimage.hotelimage.split(/\s*,\s*/).forEach((myString)=> {
              this.hotelImagesList.push(this.imgagePath + myString);
          });
          }         
        } else {
          this.noRecordFound = true;
        }       
      }, (err) => {
        this.loading.dismiss();
      });
    })
  }

  public showImagesModal(){
    if(this.hotelImagesList.length < 1){
      return false;
    }
    let options = {
      showBackdrop: false,     
      cssClass: 'modal-backdrop-bg'
    }
    var data = { message : this.hotelImagesList};
    var modalPage = this.modalCtrl.create('ImagesModalPage', data, options);
    modalPage.present();
  }  

}
