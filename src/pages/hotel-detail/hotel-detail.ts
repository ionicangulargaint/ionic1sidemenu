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
  selectedHotelDetail: any;
  selectedHotelReviews: any;
  selectedHotelRoomType: any;
  hotelImagesList: any = [];
  noRecordFound: boolean = false;
  searchCriteria: any = {};
  selectedNoOfRooms: any = 0;
  totalNoOfDays:any = 0;

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
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(this.searchCriteria.check_in_date);
    var secondDate = new Date(this.searchCriteria.check_out_date);

    this.totalNoOfDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
  }

  scrollToId() {
    let b = document.getElementById('review');
    if (b) b.scrollIntoView({ behavior: "instant" })
  }

  getHotelDetail() {
    this.createLoader();
    this.noRecordFound = false;
    this.loading.present().then(() => {
      //this.api.get('hotelDetail.php?hotelDetail=Hotel12345&hotel_id=' + this.selectedHotel).subscribe((resp: any) => {
      this.api.get('hotelDetail.php?hotelDetail=Hotel12345&hotel_id=24').subscribe((resp: any) => {
        //this.api.get('hotelDetail.php?hotelDetail=Hotel12345&hotel_id=hotelDetail=Hotel12345&hotel_id=2').subscribe((resp: any) => {
        this.loading.dismiss();
        if (resp.result == 'success') {
          this.selectedHotelDetail = resp.hotel_detail;
          let imageList = [];
          this.selectedHotelDetail.hotel_images.forEach((myString) => {
            imageList.push(this.imgagePath + myString);
          });
          this.selectedHotelDetail.customeImageList = imageList;
          // if (this.hotelInfo.hotelimage) {
          //   // if(this.hotelInfo.hotelimage.hotelimage){
          //   //   this.hotelInfo.hotelimage.split(/\s*,\s*/).forEach((myString) => {
          //   //     this.hotelImagesList.push(this.imgagePath + myString);
          //   //   });

          //   // }  
          // }
          if (resp.room_type) {
            this.createRoomTypeData(resp.room_type);
          }
          if (resp.reviews) {
            this.selectedHotelReviews = resp.reviews;
          }
        } else {
          this.noRecordFound = true;
        }
      }, (err) => {
        this.loading.dismiss();
      });
    })
  }

  counter(i: number) {
    return new Array(i);
  }

  createRoomTypeData(roomType) {
    roomType.forEach(element => {
      element.roomPhotoList = [];
      element.totalPriceCalculated = this.totalNoOfDays * element.price_per_day;


      if (element.room_image) {
        element.room_image.forEach(img => {
          element.roomPhotoList.push({ 'image': this.imgagePath + img });
        });
      } else {
        element.roomPhotoList = [];
      }



      // if (element.room_photo) {
      //   element.roomPhotoList = [];
      //   element.room_image.split(/\s*,\s*/).forEach((myString) => {
      //     element.roomPhotoList.push({ 'image': this.imgagePath + myString });
      //   });
      // } else {
      //   element.roomPhotoList = [];
      // }
    });
    this.selectedHotelRoomType = roomType;
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
      // bookingDetails: JSON.stringify({
      //   discount: this.hotelInfo.discount,
      //   noOfRooms: this.selectedNoOfRooms,
      //   selectedRoomType: selectedRoomType,
      //   hotelDetails: this.hotelInfo.hoteldetail
      // })
    });
  }




}

// hello: any = {
//   result: 'success',
//   hotel_detail: {
//     hotel_id: '17',
//     hotel_name: 'Marriof Gold INN',
//     star_rating: '5',
//     hotel_address: '925, Doroteo Street Corner',
//     hotel_city: 'Noida',
//     hotel_country: 'India',
//     hotel_review_count: '5',
//     hotel_main_image: '120318043143Hydrangeas.jpg',
//     hotel_images_list: ['120318041509Desert.jpg', '120318043143Hydrangeas.jpg', '120318041509Desert.jpg']
//   },
//   hotel_room_type: [
//     {
//       room_type_id: '10',
//       room_type_name: 'Majestic Room',
//       available_rooms_count: '10',
//       room_main_thumb: '120318041509Desert.jpg',
//       price_per_night: '100',
//       price_per_hour: '50',
//       discount_on_hour_book: '104',
//       discount_on_day_book: '500',
//       room_type_image_list: ['120318041509Desert.jpg', '120318043143Hydrangeas.jpg', '120318041509Desert.jpg'],
//       facilities: [1, 2, 3, 4],
//       hourly_available_slots_for_booking: [
//         {
//           from: '10AM',
//           to: '12AM',
//           canBook: true
//         },
//         {
//           from: '12AM',
//           to: '2PM',
//           canBook: false
//         }
//       ]
//     },
//     {
//       room_type_id: '20',
//       room_type_name: '',
//       available_rooms_count: '5',
//       room_main_thumb: '120318043143Hydrangeas.jpg',
//       price_per_night: '100',
//       price_per_hour: '50',
//       discount_on_hour_book: '104',
//       discount_on_day_book: '500',
//       room_type_image_list: ['120318041509Desert.jpg', '120318041509Desert.jpg', '120318043143Hydrangeas.jpg'],
//       facilities: [1, 2, 3, 4],
//       hourly_available_slots_for_booking: [
//         {
//           from: '10AM',
//           to: '12AM',
//           canBook: true
//         },
//         {
//           from: '12AM',
//           to: '2PM',
//           canBook: false
//         }
//       ]
//     }
//   ],
//   reviews: [
//     {
//       review_id: '34',
//       customer_name:'Bittu Singh',
//       review_text: 'Such a nice place to stay here. Love food and there services.',
//       star_rating_by_customer: '3.5',
//       vendor_name:'Raju',
//       vendor_response_text:'Thanks for your valiuable response.'
//     }
//   ]
// }
