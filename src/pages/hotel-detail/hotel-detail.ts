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

  public showImagesModal(){
    let options = {
      showBackdrop: false,
      enableBackdropDismiss: false,
      cssClass: 'modal-backdrop-bg'
    }
    var data = { message : [
      {
        src: 'https://anytimecheckin.com/new/image/front/110918062819wwee_thumb.png'
      },
      {
        src: 'https://anytimecheckin.com/new/image/front/110918052545sa_thumb.png'
      },
      {
        src: 'https://anytimecheckin.com/new/image/front/110918054734we_thumb.jpg'
      },
      {
        src: 'https://anytimecheckin.com/new/image/110918064147hmi.png'
      }
    ] };
    var modalPage = this.modalCtrl.create('ImagesModalPage', data, options);
    modalPage.present();
  }  



  navigateToPaymentsPage() {
    this.navCtrl.push('PaymentsPage'); 
  }

  getHotelDetail() {
    this.createLoader();
    this.noRecordFound = false;
    this.loading.present().then(() => {
      this.api.get('hotelDetail.php?hotelDetail=Hotel12345&hotel_id=' + this.selectedHotel).subscribe((resp: any) => {
        this.loading.dismiss();
        if(resp.result == 'success'){
          this.hotelInfo = resp;
          if(this.hotelInfo.hotel_image){
            this.hotelImagesList = this.hotelInfo.hotel_image.split(',');
          }         
        } else {
          this.noRecordFound = true;
        }       
      }, (err) => {
        this.loading.dismiss();
      });
    })
  }

}
