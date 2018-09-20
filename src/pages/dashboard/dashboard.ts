import { Component, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicPage, MenuController, NavController, Platform } from 'ionic-angular';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
declare var google;
export interface Slide {
  //title: string;
  //description: string;
  image: string;
}

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  showSkip = true;
  selectedTypeDay: boolean = true;
  selectedTypeHour: boolean = false;

  autocomplete: any;
  GoogleAutocomplete: any;
  GooglePlaces: any;
  geocoder: any
  autocompleteItems: any;
  nearbyItems: any = new Array<any>();

  slides = [
    {
      image: 'assets/img/ica-slidebox-img-1.png',
    },
    {
      image: 'assets/img/ica-slidebox-img-2.png',
    },
    {
      image: 'assets/img/ica-slidebox-img-3.png',
    }
  ];

  constructor(public zone: NgZone,
    public geolocation: Geolocation,
    public navCtrl: NavController,
    public menu: MenuController,
    public platform: Platform,
    private nativeGeocoder: NativeGeocoder
  ) {
    this.geocoder = new google.maps.Geocoder;
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }

  updateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
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
        this.autocomplete = { 'input': results[0].formatted_address };
      }
    })
  }

  navigateToGoogleMap() {
    this.navCtrl.push('pinOnMapPage'); 
  }

  getCurrentLatLongAndFindAddress() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let latlng = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      console.log(latlng);
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };
      this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options)
        .then((result: any) => {
          this.autocomplete = { 'input': result[0].formatted_address };
          console.log(JSON.stringify(result[0]));
        }).catch((error: any) => {
          alert('lat long is - '+resp.coords.latitude+' and '+resp.coords.longitude+ ' waiting for cordoav to get address');
          console.log(error)
        });

    }).catch((error) => {
      console.log('Error getting location', error);
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

  navigateToSearchedList(){
    this.navCtrl.push('SearchedHotelListPage');
     }

}
