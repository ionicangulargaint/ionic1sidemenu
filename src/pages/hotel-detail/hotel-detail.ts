import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Api } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-hotel-detail',
  templateUrl: 'hotel-detail.html'
})
export class HotelDetailPage {
  imgagePath = "https://epimoniapp.com/anytimecheckin/image/";
  selectedHotel: any = '';
  hotelInfo:any;
  noRecordFound:boolean = false;

  constructor(
    public api: Api, 
    public loadingCtrl: LoadingController, 
    public navCtrl: NavController, 
    public navParams: NavParams
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
      this.api.get('hotelDetail.php?hotelDetail=Hotel12345&hotel_id=' + this.selectedHotel).subscribe((resp: any) => {
        this.loading.dismiss();
        if(resp.result == 'success'){
          this.hotelInfo = resp;
          this.hotelInfo.hotel_image = this.hotelInfo.hotel_image.split(',');
        } else {
          this.noRecordFound = true;
        }       
      }, (err) => {
        this.loading.dismiss();
      });
    })
  }

}
