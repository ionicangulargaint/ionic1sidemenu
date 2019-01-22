import { Component } from '@angular/core';
import { ModalController, IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Api } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-hotel-detail',
  templateUrl: 'hotel-detail.html'
})
export class HotelDetailPage {

  imgagePath = "https://anytimecheckin.com/new/image/";
  selectedHotel: any = '';
  selectedHotelDetail: any;
  selectedHotelReviews: any = [];
  selectedHotelRoomType: any;
  hotelImagesList: any = [];
  noRecordFound: boolean = false;
  searchCriteria: any = { check_in_date: '' };

  totalNoOfDays: any = 0;

  constructor(
    public api: Api,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController
  ) {
    //this.selectedHotel = navParams.get('item');
    this.selectedHotel = localStorage.getItem('selected_hotel_id');
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
    this.getHotelReviews();
    this.searchCriteria = JSON.parse(localStorage.getItem('dashboardSearch'));
    if (this.searchCriteria) {
      var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      var firstDate = new Date(this.searchCriteria.check_in_date);
      var secondDate = new Date(this.searchCriteria.check_out_date);

      this.totalNoOfDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
    } else {
      this.totalNoOfDays = 1;
    }
  }

  scrollToId() {
    let b = document.getElementById('review');
    if (b) b.scrollIntoView({ behavior: "instant" })
  }

  navigateToSearchedHotelOnmapPage() {
    this.navCtrl.push('SearchedHotelOnmapPage', {
      'hotelList': [
        {
          hotel_latitude: this.selectedHotelDetail.hotel_latitude,
          hotel_longitude: this.selectedHotelDetail.hotel_longitude,
          hotel_name: this.selectedHotelDetail.hotel_name
        }]
    });
  }

  getHotelDetail() {
    this.createLoader();
    this.noRecordFound = false;
    this.loading.present().then(() => {
      this.api.get(`hotelDetail.php?hotelDetail=Hotel12345&hotel_id=${this.selectedHotel}`).subscribe((resp: any) => {
        // this.api.get('hotelDetail.php?hotelDetail=Hotel12345&hotel_id=24').subscribe((resp: any) => {        
        this.loading.dismiss();
        if (resp.result == 'success') {
          this.selectedHotelDetail = resp.hotel_detail;
          let imageList = [];
          this.selectedHotelDetail.hotel_images.forEach((myString) => {
            imageList.push(this.imgagePath + myString);
          });
          this.selectedHotelDetail.customeImageList = imageList;
          if (resp.room_type) {
            this.createRoomTypeData(resp.room_type);
          }

        } else {
          this.noRecordFound = true;
        }
      }, (err) => {
        this.loading.dismiss();
      });
    })
  }

  getHotelReviews() {
    this.api.get(`user_vendor_review.php?UserReview=ARQP12345&hotel_id=${this.selectedHotel}`).subscribe((resp: any) => {
      if (resp.result == 'success') {
        this.selectedHotelReviews = resp.reviews;
      } else {
        this.noRecordFound = true;
      }
    }, (err) => {
      alert(err)
    });
  }

  counter(i: number) {
    return new Array(i);
  }

  createRoomTypeData(roomType) {
    roomType.forEach(element => {
      element.roomPhotoList = [];
      element.totalPriceCalculated = this.searchCriteria.no_of_rooms * element.price_per_day;
      if (this.searchCriteria) {
        element.selectedNoOfRooms = this.searchCriteria.no_of_rooms;
        element.check_in_date = this.searchCriteria.check_in_date
      } else {
        element.selectedNoOfRooms = 1;
      }
      if (element.room_image) {
        element.room_image.forEach(img => {
          element.roomPhotoList.push({ 'image': this.imgagePath + img });
        });
      } else {
        element.roomPhotoList = [];
      }
    });
    this.selectedHotelRoomType = roomType;
  }

  noOfRoomChange(currentRoomType) {
    currentRoomType.totalPriceCalculated = currentRoomType.price_per_day * currentRoomType.selectedNoOfRooms;
    currentRoomType;
  }

  public showImagesModal(photoList) {
    if (photoList.length < 1) {
      return false;
    }
    let options = {
      showBackdrop: false,
      cssClass: 'modal-backdrop-bg'
    }
    console.log(photoList);
    var data = { message: photoList };
    var modalPage = this.modalCtrl.create('ImagesModalPage', data, options);
    modalPage.present();
  }


  navigateToPaymentsPage(selectedRoomType) {
    this.navCtrl.push('PaymentsPage', {
      bookingDetails: JSON.stringify({
        apiParam: {
          hotel_id: this.selectedHotel,
          book_now: 1,
          noofroom: selectedRoomType.selectedNoOfRooms,
          hotel_room_type_id: selectedRoomType.room_type_id,
          no_of_person: this.searchCriteria.no_of_adults,
          no_of_childs: this.searchCriteria.no_of_childs,
          check_in_date: this.searchCriteria.check_out_date,
          check_out_date: this.searchCriteria.check_out_date,
          check_in_time: this.searchCriteria.check_in_time,
          check_out_time: this.searchCriteria.check_out_time,
          optradio: this.searchCriteria.optradio,
          no_of_days: this.totalNoOfDays,
          no_of_hours: ''
        },
        hotelDetails: {
          hotel_image: this.selectedHotelDetail.main_image,
          hotel_address: `${this.selectedHotelDetail.hotel_address} ${this.selectedHotelDetail.hotel_city}`,
          ratings: this.selectedHotelDetail.hotel_star_category,
          hotel_name: this.selectedHotelDetail.hotel_name,
          lat: this.selectedHotelDetail.hotel_longitude,
          long: this.selectedHotelDetail.hotel_longitude
        }
      })
    });
  }

}
