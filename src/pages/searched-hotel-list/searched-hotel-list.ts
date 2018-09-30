import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, LoadingController, Loading } from 'ionic-angular';

import { Api } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-searched-hotel-list',
  templateUrl: 'searched-hotel-list.html'
})
export class SearchedHotelListPage {

  hotelList: any = [];
  searchParam: any = {};
  bookingType:boolean = false;

  constructor(public api: Api, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.searchParam = navParams.get('searchCriterias');
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

  // getHotelList(ev) {
  //   let val = ev.target.value;
  //   if (!val || !val.trim()) {
  //     this.currentItems = [];
  //     return;
  //   }
  //   this.currentItems = this.items.query({
  //     name: val
  //   });
  // }
  getHotelList() {
    this.createLoader();
    this.loading.present().then(() => {

      this.api.get('searchResult.php?searchResult=SearchResult12345', this.searchParam).subscribe((resp: any) => {
        this.loading.dismiss();
        if(resp.result == 'success'){
          this.bookingType = resp.booking_type;
          this.hotelList = resp.searchResult;
        }        
      }, (err) => {
        this.loading.dismiss();
      });
    })
  }



  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: any) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }

  navigateToHotelDetail(item) {
    this.navCtrl.push('HotelDetailPage', {'item': item.hotel_id });
  }

  navigateToSearchedHotelOnmapPage() {
    this.navCtrl.push('SearchedHotelOnmapPage');
  }

  ionViewDidLoad() {
    this.getHotelList();
  }

}
