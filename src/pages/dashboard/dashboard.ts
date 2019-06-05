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
  imgagePath = "https://anytimecheckin.com/new/image/";
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

  checkoutDate: any = new Date().setDate(new Date().getDate() + 1);
  nextThreeMonth: any = new Date().setMonth((new Date()).getMonth() + 3);
  nextSixMonth: any = new Date().setMonth((new Date()).getMonth() + 6);

  selectedDates: any = {
    checkInDate: this.getFormatedDate(new Date()),
    checkInMinDate: this.getFormatedDate(new Date()),
    checkInMaxDate: this.getFormatedDate(this.nextThreeMonth),
    checkoutDate: this.getFormatedDate(this.checkoutDate),
    checkoutMinDate: this.getFormatedDate(this.checkoutDate),
    checkoutMaxDate: this.getFormatedDate((new Date(this.nextThreeMonth)).setDate((new Date(this.nextThreeMonth)).getDate() + 1))
  }
  selectedTime: any = {
    selectedHours: 2,
    checkInDate: this.getFormatedDate(new Date()),
    checkInTime: this.getFormatedTime(new Date()),
    //checkoutTime: this.getFormatedTime(new Date(new Date().setHours(new Date().getHours() + 2))),
    checkoutTime: this.getFormatedTime(new Date(new Date().setHours(new Date().getHours() + 2))),
    checkInMinDate: this.getFormatedDate(new Date()),
    //checkInMaxDate: this.getFormatedDate(new Date().setDate(new Date().getDate() + 3)),
    checkInMaxDate: this.getFormatedDate((new Date(this.nextSixMonth)).setDate((new Date(this.nextSixMonth)).getDate() + 1))
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

  chekInDateChangeEvent(){
    if((new Date(this.selectedDates.checkInDate)) >= (new Date(this.selectedDates.checkoutDate))){    
    let checkoutDateConverted = new Date(this.selectedDates.checkInDate);
    this.selectedDates.checkoutDate = this.getFormatedDate(checkoutDateConverted.setDate(checkoutDateConverted.getDate() + 1));
    this.selectedDates.checkoutMinDate = this.getFormatedDate(checkoutDateConverted.setDate(checkoutDateConverted.getDate() + 0));
    }
  }

  updateSearchResults() {
    if (this.autocompleteInput == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocompleteInput },
      (predictions, status) => {
        this.autocompleteItems = [];
        console.log(predictions)
        if (predictions != null && predictions.length != 0 && predictions != undefined) {
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          });
        }
      });
  }

  selectSearchResult(item) {
    //console.log(item)
    this.autocompleteItems = [];
    this.commonService.createLoader();
    this.commonService.loading.present().then(() => {
      this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
        this.commonService.loading.dismiss();
        console.log(results[0])
        console.log(status)
        if (status === 'OK' && results[0]) {
          this.selectedLocation.lat = results[0].geometry.location.lat();
          this.selectedLocation.lng = results[0].geometry.location.lng();
          this.autocompleteItems = [];
          this.autocompleteInput = results[0].formatted_address;
          this.selectedLocation.address = results[0].formatted_address;
        }
      }, (error) => {
        console.log(error);
      })
    }).catch((error) => {
      console.log('Error getting location', error);
      this.commonService.loading.dismiss();
    });
  }

  navigateToGoogleMap() {
    this.navCtrl.push('pinOnMapPage');
  }

  getCurrentLatLongAndFindAddress() {
    var options = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 0
    };
    this.commonService.createLoader();
    this.commonService.loading.present().then(() => {
      this.geolocation.getCurrentPosition(options).then((res) => {
        var latlng = {
          lat: res.coords.latitude,
          lng: res.coords.longitude
        };
        console.log(latlng);
        this.selectedLocation.lat = res.coords.latitude;
        this.selectedLocation.lng = res.coords.longitude;
        this.reverseGeocode(latlng);
      }).catch((error) => {
        console.log( error);
        // if (navigator.geolocation) {
        //   navigator.geolocation.getCurrentPosition((res) => {
        //     var latlng = {
        //       lat: res.coords.latitude,
        //       lng: res.coords.longitude
        //     };
        //     console.log(latlng);
        //     this.selectedLocation.lat = res.coords.latitude;
        //     this.selectedLocation.lng = res.coords.longitude;
        //     this.reverseGeocode(latlng);
        //   }
        //   );
        // }
      });
    })
  }

  reverseGeocode(latlng) {
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
    }).catch((error) => {
      console.log('Error in reverse geocode location', error);
      this.commonService.loading.dismiss();
      this.commonService.showAlert('Error getting location ' + error);
    });
  }

  addguestDetails() {
    this.navCtrl.push('AddGuestDetailPage', { 'guestDetails': this.guestDetails });
  }

  change(type) {
    if (type == 'Day') {
      this.selectedTypeHour = !this.selectedTypeDay;
      this.selectedTime = {
        selectedHours: 2,
        checkInDate: this.getFormatedDate(new Date()),
        checkInTime: this.getFormatedTime(new Date()),
        //checkoutTime: this.getFormatedTime(new Date(new Date().setHours(new Date().getHours() + 2))),
        checkoutTime: this.getFormatedTime(new Date(new Date().setHours(new Date().getHours() + 2))),
        checkInMinDate: this.getFormatedDate(new Date()),
        //checkInMaxDate: this.getFormatedDate(new Date().setDate(new Date().getDate() + 3)),
        checkInMaxDate: this.getFormatedDate((new Date(this.nextSixMonth)).setDate((new Date(this.nextSixMonth)).getDate() + 1))
      }
    } else {
      this.selectedTypeDay = !this.selectedTypeHour;
      this.selectedDates = {
        checkInDate: this.getFormatedDate(new Date()),
        checkInMinDate: this.getFormatedDate(new Date()),
        checkInMaxDate: this.getFormatedDate(this.nextThreeMonth),
        checkoutDate: this.getFormatedDate(this.checkoutDate),
        checkoutMinDate: this.getFormatedDate(this.checkoutDate),
        checkoutMaxDate: this.getFormatedDate((new Date(this.nextThreeMonth)).setDate((new Date(this.nextThreeMonth)).getDate() + 1))
      }
    }
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
    //var ampm = hours >= 12 ? 'pm' : 'am';
    //hours = hours % 12;
    //hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    //var strTime = hours + ':' + minutes + ' ' + ampm;
    var strTime = hours + ':' + minutes;
    return strTime;
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  getCheckOutDate() {
    var temp = this.selectedTime.checkInDate.split('-');
    var temp1 = this.selectedTime.checkInTime.split(':');
    var d = new Date(temp[0], temp[1] - 1, temp[2]);
    d.setHours(parseInt(temp1[0]) + parseInt(this.selectedTime.selectedHours), parseInt(temp1[1]));
    return this.getFormatedDate(d);
  }

  getCheckOutTime() {
    var temp = this.selectedTime.checkInTime.split(':');
    var d = new Date();
    d.setHours(parseInt(temp[0]) + parseInt(this.selectedTime.selectedHours), parseInt(temp[1]));
    return this.getFormatedTime(d);
  }

  navigateToSearchedList() {
    let data = {
      optradio: this.selectedTypeDay ? 1 : 2,
      check_in_date: this.selectedTypeDay ? this.selectedDates.checkInDate : this.selectedTime.checkInDate,
      check_in_time: this.selectedTypeDay ? '00:00' : this.selectedTime.checkInTime,
      check_out_date: this.selectedTypeDay ? this.selectedDates.checkoutDate : this.getCheckOutDate(),
      check_out_time: this.selectedTypeDay ? '00:00' : this.getCheckOutTime(),
      no_of_adults: this.guestDetails.adult,
      no_of_rooms: this.guestDetails.rooms,
      no_of_childs: this.guestDetails.children,
      lat: this.selectedLocation.lat,
      lng: this.selectedLocation.lng,
      selectedTypeDay: this.selectedTypeDay,
      selectedAddress: this.selectedLocation.address,
      hr: this.selectedTime.selectedHours
    }
    localStorage.setItem('dashboardSearch', JSON.stringify(data));
    this.navCtrl.push('SearchedHotelListPage');
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
        } else if (res.result == "failed") {
          //this.slidesHide = true;
        }
      }, err => {
        this.commonService.loading.dismiss();
        console.error('ERROR', err);
      });
    })
  }

  getTopHotels() {
    let seq = this.api.get('topHotelsforHome.php').share();
    seq.subscribe((res: any) => {
      if (res.responseCode == "200") {
        this.allTopHotelsList = res.topHotels;
        this.topHotelsLIst = res.topHotels.slice(0, 4);
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
    let data = {
      optradio: this.selectedTypeDay ? 1 : 2,
      check_in_date: this.selectedTypeDay ? this.selectedDates.checkInDate : this.selectedTime.checkInDate,
      check_in_time: this.selectedTypeDay ? '00:00' : this.selectedTime.checkInTime,
      check_out_date: this.selectedTypeDay ? this.selectedDates.checkoutDate : this.getCheckOutDate(),
      check_out_time: this.selectedTypeDay ? '00:00' : this.getCheckOutTime(),
      no_of_adults: this.guestDetails.adult,
      no_of_rooms: this.guestDetails.rooms,
      no_of_childs: this.guestDetails.children,
      lat: this.selectedLocation.lat,
      lng: this.selectedLocation.lng,
      selectedTypeDay: this.selectedTypeDay,
      selectedAddress: this.selectedLocation.address
    }
    localStorage.setItem('dashboardSearch', JSON.stringify(data));

    localStorage.setItem('selected_hotel_id', item.hotel_id)
    this.navCtrl.push('HotelDetailPage', { 'item': item.hotel_id });
  }

  getCurrentLocation() {
    var options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };
    this.geolocation.getCurrentPosition(options).then((resp) => {
      this.selectedLocation.lat = resp.coords.latitude;
      this.selectedLocation.lng = resp.coords.longitude;
      this.geocoder.geocode({ 'location': { lat: resp.coords.latitude, lng: resp.coords.longitude } }, (results, status) => {
        // this.commonService.loading.dismiss();
        if (status === 'OK') {
          if (results[0]) {
            this.selectedLocation.address = results[0].formatted_address;
          }
        } else {
          this.commonService.showAlert('Geocoder failed due to: ' + status);
        }
      }, (error) => {
        console.log(error);
      });
    }).catch((error) => {
      // this.commonService.loading.dismiss();
      console.log('Error getting location', error);
    });
  }

  //postmesage starts here

  sentMessage(){
    let payment_frame:any = document.getElementById('payment_frame');
    payment_frame.contentWindow.postMessage('hello', 'http://netmaxims.in');
    window.addEventListener('message',function(event) {
      if(event.origin !== 'http://netmaxims.in') return;
      console.log('received response:  ',event.data);
    },false);
  }

}
