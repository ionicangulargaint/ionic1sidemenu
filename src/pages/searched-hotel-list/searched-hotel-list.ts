import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Api,CommonService } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-searched-hotel-list',
  templateUrl: 'searched-hotel-list.html'
})
export class SearchedHotelListPage {
  imgagePath = "https://anytimecheckin.com/new/image/";
  hotelList: any = [];
  searchParam: any = {};
  bookingType:boolean = false;
  selectedAddress:any;
  noResultFound:boolean = false;

  constructor(
    public api: Api, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public loadingCtrl: LoadingController,
    public commonService: CommonService
    ) {
    this.searchParam = navParams.get('searchCriterias');
    this.selectedAddress = navParams.get('selectedAddress');
    if(this.searchParam.optradio == 1){
      this.bookingType = true;
    }
  }

  loading: Loading;
  loadingConfig: any;
  createLoader(message: string = "Please wait...") {
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  getHotelList() {
    this.createLoader();
    this.loading.present().then(() => {
      this.api.get('search.php', this.searchParam).subscribe((resp: any) => {
        this.loading.dismiss();
        if(resp.searchResult != 0){
          this.bookingType = resp.booking_type;
          this.hotelList = resp.searchResult;
          this.noResultFound =  false;
        } else {
          this.noResultFound = true;
        }        
      }, (err) => {
        this.loading.dismiss();
      });
    })
  }

  /**
   * Navigate to the detail page for this item.
   */

  navigateToHotelDetail(item) {
    this.navCtrl.push('HotelDetailPage', {'item': item.hotel_id });
  }

  navigateToSearchedHotelOnmapPage() {
    if(this.hotelList.length > 0){
      this.navCtrl.push('SearchedHotelOnmapPage', {'hotelList': this.hotelList });
    } else {
      this.commonService.showAlert('No result found');
    }
  }

  ionViewDidLoad() {
    this.getHotelList();
  }
  searchAgain(){
    this.navCtrl.pop();
  }

}
