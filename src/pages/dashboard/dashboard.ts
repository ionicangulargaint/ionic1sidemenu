import { Component, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Events, IonicPage, MenuController, NavController, Platform, NavParams } from 'ionic-angular';
import { Api, CommonService } from '../../providers';
import { DatePicker } from '@ionic-native/date-picker';
declare var google;

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  imgagePath = "https://epimoniapp.com/anytimecheckin/image/";
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
  topHotelsLIst: any = [];
  allTopHotelsList: any = [];
  showMore: boolean = false;

  guestDetails: any = {
    rooms: 1,
    adult: 1,
    children: 0
  };
  selectedDates: any = {
    checkInDate: this.getFormatedDate(new Date()),
    checkoutDate: this.getFormatedDate(new Date().setDate(new Date().getDate() + 1))
  }
  selectedTime: any = {
    checkInTime: this.getFormatedTime(new Date()),
    checkoutTime: this.getFormatedTime(new Date())
  }
  selectedLocation: any = {
    lat: '',
    lng: '',
    address: ''
  }

  constructor(public events: Events,
    public zone: NgZone,
    public geolocation: Geolocation,
    public navCtrl: NavController,
    public menu: MenuController,
    public platform: Platform,
    public api: Api,
    public navParams: NavParams,
    public commonService: CommonService,
    private datePicker: DatePicker
  ) {
    var mapSearchObj = navParams.get('mapSearchObj');
    if (mapSearchObj) {
      this.autocompleteInput = mapSearchObj.address;
      this.selectedLocation.lat = mapSearchObj.latitude;
      this.selectedLocation.lng = mapSearchObj.longitude;
      this.selectedLocation.address = mapSearchObj.address;
    }

    this.platform.ready().then((readySource) => {
      this.getCurrentLocation();
    });
    this.geocoder = new google.maps.Geocoder;
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocompleteItems = [];

    // update guest details using change event
    events.subscribe('guest:updateDetail', (guest, time) => {
      this.guestDetails = guest;
      console.log(this.guestDetails);
    });
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
    this.commonService.createLoader();
    this.commonService.loading.present().then(() => {
      this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
        this.commonService.loading.dismiss();
        if (status === 'OK' && results[0]) {
          this.selectedLocation.lat = results[0].geometry.location.lat();
          this.selectedLocation.lng = results[0].geometry.location.lng();
          this.autocompleteItems = [];
          this.autocompleteInput = results[0].formatted_address;
          this.selectedLocation.address = results[0].formatted_address;
        }
      })
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
      this.selectedLocation.lat = res.coords.latitude;
      this.selectedLocation.lng = res.coords.longitude;
      this.commonService.createLoader();
      this.commonService.loading.present().then(() => {
        this.geocoder.geocode({ 'location': latlng }, (results, status) => {
          this.commonService.loading.dismiss();
          if (status === 'OK') {
            if (results[0]) {
              this.autocompleteInput = results[0].formatted_address;
              this.selectedLocation.address = results[0].formatted_address;
            } else {
              this.commonService.showAlert('No results found');
            }
          } else {
            this.commonService.showAlert('Geocoder failed due to: ' + status);
          }
        });
      }).catch((error) => {
        this.commonService.showAlert('Error getting location ' + error);
      });
    })
  }

  addguestDetails() {
    this.navCtrl.push('AddGuestDetailPage', { 'guestDetails': this.guestDetails });
  }

  change(type) {
    if (type == 'Day') {
      this.selectedTypeHour = !this.selectedTypeDay;
    } else {
      this.selectedTypeDay = !this.selectedTypeHour;
    }
  }

  openDatePicker(pickerIs) {
    var dateString = (new Date()).toISOString();
    dateString = dateString.split(' ').join('T');
    let date: any = new Date(dateString);
    date = date.getTime();
    //let minDate = (pickerIs == 'CHECKIN') ? (date) : (new Date()).setDate((new Date()).getDate() + 3);
    var maxDate = this.selectedTypeDay ? (new Date()).setMonth((new Date()).getMonth() + 3) : (new Date()).setDate((new Date()).getDate() + 3);
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      minDate: (pickerIs == 'CHECKIN') ? (date) : (new Date()).setDate((new Date()).getDate() + 1),
      maxDate: (pickerIs == 'CHECKIN') ? (maxDate) : (new Date(maxDate)).setDate((new Date(maxDate)).getDate() + 1),
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => {
        if (pickerIs == 'CHECKIN') {
          this.selectedDates.checkInDate = this.getFormatedDate(date);
        } else {
          this.selectedDates.checkoutDate = this.getFormatedDate(date);
        }
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  openTimePicker(pickerIs) {
    var dateString = (new Date()).toISOString();
    dateString = dateString.split(' ').join('T');
    let date: any = new Date(dateString);
    date = date.getTime();
    //let minDate = (pickerIs == 'CHECKIN') ? (date) : (new Date()).setDate((new Date()).getDate() + 3);
    this.datePicker.show({
      date: new Date(),
      mode: 'time',
      minDate: date,
      maxDate: date,
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      time => {
        if (pickerIs == 'CHECKIN') {
          this.selectedTime.checkInTime = this.getFormatedTime(time);
        } else {
          this.selectedTime.checkoutTime = this.getFormatedTime(time);
        }
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  getFormatedDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  getFormatedTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

  navigateToSearchedList() {
    let data = {
      optradio: this.selectedTypeDay ? 1 : 2,
      check_in_date: this.selectedDates.checkInDate,
      check_in_time: this.selectedTypeDay ? '00:00:00' : this.selectedTime.checkInTime,
      check_out_date: this.selectedTypeDay ? this.selectedDates.checkoutDate : this.selectedDates.checkInDate,
      check_out_time: this.selectedTypeDay ? '00:00:00' : this.selectedTime.checkoutTime,
      no_of_adults: this.guestDetails.adult,
      no_of_rooms: this.guestDetails.rooms,
      no_of_childs: this.guestDetails.children,
      lat: this.selectedLocation.lat,
      lng: this.selectedLocation.lng
    }
    this.navCtrl.push('SearchedHotelListPage', { 'searchCriterias': data, 'selectedAddress':this.selectedLocation.address });
  }

  ionViewDidLoad() {
    this.getFeaturedAds();
    this.getTopHotels();
  }

  getFeaturedAds() {
    this.commonService.createLoader();
    this.commonService.loading.present().then(() => {
      let seq = this.api.get('featuredAd.php?featuredAd=Ad12345').share();
      seq.subscribe((res: any) => {
        this.commonService.loading.dismiss();
        if (res.result == "success") {
          this.slides = res.feature_ad;
        } else {

        }
      }, err => {
        this.commonService.loading.dismiss();
        console.error('ERROR', err);
      });
    })
  }

  getTopHotels() {
    let seq = this.api.get('topHotels.php?tophotels=topHotels12345').share();
    seq.subscribe((res: any) => {
      if (res.result == "success") {
        if (res.topHotelsDetails.length > 4) {
          this.topHotelsLIst = res.topHotelsDetails.slice(0, 4);
          this.allTopHotelsList = res.topHotelsDetails;
        } else {
          this.topHotelsLIst = res.topHotelsDetails;
        }
      }
    }, err => {
      console.error('ERROR', err);
    });
  }

  showMoreHotel() {
    this.showMore = true;
    this.topHotelsLIst = this.allTopHotelsList;
  }

  navigateToHotelDetail(item) {
    this.navCtrl.push('HotelDetailPage', { 'item': item.hotel_id });
  }

  getCurrentLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.selectedLocation.lat = resp.coords.latitude;
      this.selectedLocation.lng = resp.coords.longitude;
      this.commonService.createLoader();
      this.geocoder.geocode({ 'location': { lat: resp.coords.latitude, lng: resp.coords.longitude } }, (results, status) => {
        this.commonService.loading.dismiss();
        if (status === 'OK') {
          if (results[0]) {
            this.selectedLocation.address = results[0].formatted_address;
          }
        } else {
          this.commonService.showAlert('Geocoder failed due to: ' + status);
        }
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

}
