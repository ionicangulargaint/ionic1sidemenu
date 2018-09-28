import { Component, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicPage, MenuController, NavController, Platform, LoadingController, Loading, NavParams } from 'ionic-angular';
import { Api, CommonService } from '../../providers';

declare var google;
let geocoder: any;

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  showSkip = true;
  selectedTypeDay: boolean = true;
  selectedTypeHour: boolean = false;
  autocompleteInput: any;
  GoogleAutocomplete: any;
  GooglePlaces: any;
  geocoder: any
  autocompleteItems: any;
  nearbyItems: any = new Array<any>();
  slides: any = [];
  guestDetails:any;

  loading: Loading;
  loadingConfig: any;
  createLoader(message: string = "Please wait...") {
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }
  constructor(public zone: NgZone,
    public loadingCtrl: LoadingController,
    public geolocation: Geolocation,
    public navCtrl: NavController,
    public menu: MenuController,
    public platform: Platform,
    public api: Api,
    public navParams: NavParams,
    public commonService:CommonService
  ) {
    this.autocompleteInput = navParams.get('param1'); 
    this.guestDetails = this.commonService.getGuestDetails();
    console.log(this.guestDetails);
    
    this.platform.ready().then((readySource) => {
      this.getCurrentLocation();
    });
    this.geocoder = new google.maps.Geocoder;
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocompleteItems = [];
  }

  updateSearchResults() {
    if (this.autocompleteInput == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocompleteInput },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      });
  }

  selectSearchResult(item) {
    this.autocompleteItems = [];
    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        console.log(results[0].formatted_address);
        this.autocompleteItems = [];
        this.autocompleteInput =  results[0].formatted_address;
      }
    })
  }

  navigateToGoogleMap() {
    this.navCtrl.push('pinOnMapPage');
  }

  getCurrentLatLongAndFindAddress() {
    this.geolocation.getCurrentPosition().then((res) => {
      let latlng = {
        lat: res.coords.latitude,
        lng: res.coords.longitude
      };
      console.log(latlng);
      geocoder = new google.maps.Geocoder;
      geocoder.geocode({ 'location': latlng }, function (results, status) {
        if (status === 'OK') {
          if (results[0]) {
            this.autocompleteInput = results[0].formatted_address;
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });
    }).catch((error) => {
      window.alert('Error getting location '+ error);
    });
  }

  addguestDetails() {
    this.navCtrl.push('AddGuestDetailPage');
  }

  change(type) {
    if (type == 'Day') {
      this.selectedTypeHour = !this.selectedTypeDay;
    } else {
      this.selectedTypeDay = !this.selectedTypeHour;
    }
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    // this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

  navigateToSearchedList() {
    this.navCtrl.push('SearchedHotelListPage');
  }

  ionViewDidLoad() {
    this.getFeaturedAds();
  }

  getFeaturedAds() {
    this.createLoader();
    this.loading.present().then(() => {
      let seq = this.api.get('featuredAd.php?featuredAd=Ad12345').share();
      seq.subscribe((res: any) => {
        this.loading.dismiss();
        if (res.result == "success") {
          this.slides = res.feature_ad;
        } else {

        }
      }, err => {
        this.loading.dismiss();
        console.error('ERROR', err);
      });
    })
  }

  getCurrentLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let latlng = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      console.log('CurrentLocation.. '+latlng);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

}
