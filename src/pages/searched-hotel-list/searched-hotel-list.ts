import { Component } from '@angular/core';
import { ToastController, IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Api, CommonService } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-searched-hotel-list',
  templateUrl: 'searched-hotel-list.html'
})
export class SearchedHotelListPage {
  imgagePath = "https://anytimecheckin.com/new/image/";
  hotelList: any = [];
  searchParam: any = {};
  bookingType: boolean = false;
  selectedAddress: any;
  noResultFound: boolean = false;

  filterObj: any = {
    star0: { value: '4', checked: false },
    star1: { value: '1', checked: false },
    star2: { value: '2', checked: false },
    star3: { value: '3', checked: false },
    budget_1: { value: '1_15', checked: false },
    budget_2: { value: '75_100', checked: false },
    budget_3: { value: '100_125', checked: false },
    budget_4: { value: '125_above', checked: false },
    rating1: { value: '1', checked: false },
    rating2: { value: '2', checked: false },
    rating3: { value: '3', checked: false },
    rating4: { value: '4', checked: false },
    rating5: { value: '5', checked: false }
  }

  constructor(
    public api: Api,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public commonService: CommonService,
    public toastCtrl: ToastController
  ) {
    this.searchParam  = JSON.parse(localStorage.getItem('dashboardSearch'));
    if(this.searchParam){
      if(this.searchParam.optradio == 1){
        this.bookingType = true;
      }
    }
  }

  loading: Loading;
  loadingConfig: any;
  createLoader(message: string = "Please wait...") {
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  roundOffDistance(distance){
    distance = Number(distance);
    return distance.toFixed(4);
  }

  getHotelList() {
    this.createLoader();
    let searchParm = this.createObj();
    this.loading.present().then(() => {
      this.api.get('searchResult.php?searchResult=SearchResult12345', searchParm).subscribe((resp: any) => {
        this.loading.dismiss();
        if (resp.result == 'success') {
          this.hotelList = resp.searchResult;
          this.noResultFound = false;
        } else {
          this.noResultFound = true;
          this.presentToast('No hotel found. Try search again!');
        }
      }, (err) => {
        this.loading.dismiss();
      });
    })
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'middle',
      showCloseButton: true,
      closeButtonText:	"Ok",
      dismissOnPageChange: true,
      duration: 3000	
    });
  
    toast.onDidDismiss(() => {
      //this.searchAgain();
    });
  
    toast.present();
  }

  createObj() {
    let obj = {
      no_of_rooms: this.searchParam.no_of_rooms,
      no_of_childs:  this.searchParam.no_of_childs,
      no_of_adults:  this.searchParam.no_of_adults,
      check_in_date:  this.searchParam.check_in_date,
      check_out_date:  this.searchParam.check_out_date,
      check_in_time:  this.searchParam.check_in_time,
      check_out_time:  this.searchParam.check_out_time,
      lat:  this.searchParam.lat,
      lng:  this.searchParam.lng,
      optradio:  this.searchParam.optradio,
      location:  this.searchParam.selectedAddress,
      star0: this.filterObj.star0.checked ? '4' : '',
      star1: this.filterObj.star1.checked ? '1' : '',
      star2: this.filterObj.star2.checked ? '2' : '',
      star3: this.filterObj.star3.checked ? '3' : '',
      budget_1: this.filterObj.budget_1.checked ? '1_15' : '',
      budget_2: this.filterObj.budget_2.checked ? '75_100' : '',
      budget_3: this.filterObj.budget_3.checked ? '100_125' : '',
      budget_4: this.filterObj.budget_4.checked ? '125_above' : '',
      rating1: this.filterObj.rating1.checked ? '1' : '',
      rating2: this.filterObj.rating2.checked ? '2' : '',
      rating3: this.filterObj.rating3.checked ? '3' : '',
      rating4: this.filterObj.rating4.checked ? '4' : '',
      rating5: this.filterObj.rating5.checked ? '5' : '',
      hr:  this.searchParam.hr
    }
    return obj;
  }

  /**
   * Navigate to the detail page for this item.
   */

  navigateToHotelDetail(item) {
    localStorage.setItem('selected_hotel_id', item.hotel_id);
    this.navCtrl.push('HotelDetailPage', { 'item': item.hotel_id });
  }

  navigateToSearchedHotelOnmapPage() {
    if (this.hotelList.length > 0) {
      this.navCtrl.push('SearchedHotelOnmapPage', { 'hotelList': this.hotelList });
    } else {
      this.commonService.showAlert('No result found');
    }
  }

  ionViewDidLoad() {
    this.getHotelList();
  }
  searchAgain() {
    this.navCtrl.pop();
  }

}
