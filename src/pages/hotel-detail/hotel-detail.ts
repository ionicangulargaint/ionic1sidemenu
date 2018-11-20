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
  hotelInfo: any;
  hotelImagesList: any = [];
  noRecordFound: boolean = false;
  searchCriteria: any = {};
  selectedNoOfRooms: any = 0;

  constructor(
    public api: Api,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController
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
    this.searchCriteria = JSON.parse(localStorage.getItem('dashboardSearch'));
    this.selectedNoOfRooms = this.searchCriteria.no_of_rooms;
  }

  getHotelDetail() {
    this.createLoader();
    this.noRecordFound = false;
    this.loading.present().then(() => {
      this.api.get('hotelDetail.php?hotelDetail=Hotel12345&hotel_id=' + this.selectedHotel).subscribe((resp: any) => {
      //this.api.get('hotelDetail.php?hotelDetail=Hotel12345&hotel_id=hotelDetail=Hotel12345&hotel_id=2').subscribe((resp: any) => {
        this.loading.dismiss();
        if (resp.result == 'success') {
          this.hotelInfo = resp;
          if (this.hotelInfo.hotelimage) {
            this.hotelInfo.hotelimage.hotelimage.split(/\s*,\s*/).forEach((myString) => {
              this.hotelImagesList.push(this.imgagePath + myString);
            });
            this.createRoomTypeData();
          }
        } else {
          this.noRecordFound = true;
        }
      }, (err) => {
        this.loading.dismiss();
      });
    })
  }

  createRoomTypeData() {
    this.hotelInfo.roomtype.forEach(element => {
      if (element.room_photo) {
        element.roomPhotoList = [];
        element.room_photo.split(/\s*,\s*/).forEach((myString) => {
          element.roomPhotoList.push(this.imgagePath + myString);
        });
      } else {
        element.roomPhotoList = [];
      }
    });
  }

  public showImagesModal(photoList) {
    if (photoList.length < 1) {
      return false;
    }
    let options = {
      showBackdrop: false,
      cssClass: 'modal-backdrop-bg'
    }
    var data = { message: photoList };
    var modalPage = this.modalCtrl.create('ImagesModalPage', data, options);
    modalPage.present();
  }


  navigateToPaymentsPage(selectedRoomType) {
    this.navCtrl.push('PaymentsPage', {
      bookingDetails: JSON.stringify({
        discount: this.hotelInfo.discount,
        noOfRooms: this.selectedNoOfRooms,
        selectedRoomType: selectedRoomType,
        hotelDetails: this.hotelInfo.hoteldetail
      })
    });
  }

}
