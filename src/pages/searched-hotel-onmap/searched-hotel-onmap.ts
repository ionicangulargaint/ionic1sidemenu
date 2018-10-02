import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Items,CommonService } from '../../providers';

declare var google;
let map: any;
let infowindow: any;
let hotelID:any;

let options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

@IonicPage()
@Component({
  selector: 'page-searched-hotel-onmap',
  templateUrl: 'searched-hotel-onmap.html'
})

export class SearchedHotelOnmapPage {
  @ViewChild('map') mapElement: ElementRef;
  hotelList: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public items: Items,
    public geolocation: Geolocation,
    public commonService:CommonService
  ) {
    this.hotelList = navParams.get('hotelList');
    console.log(this.hotelList);
  }

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    //this.geolocation.getCurrentPosition().then((res) => {
    map = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: parseFloat(this.hotelList[0].hotel_latitude), lng: parseFloat(this.hotelList[0].hotel_longitude) },
      zoom: 15
    });
    for (var i = 0; i < this.hotelList.length; i++) {
      infowindow = new google.maps.InfoWindow();
      this.createMarker(this.hotelList[i]);
    }
    //}).catch((error) => {
    // window.alert('Error getting location '+ error);
    //});
  }

  createMarker(item) {
    var placeLoc = { lat: parseFloat(item.hotel_latitude), lng: parseFloat(item.hotel_longitude) }
    var marker = new google.maps.Marker({
      map: map,
      position: placeLoc
    });
    infowindow.setContent('<b>' + item.hotel_name + '</b>');
    infowindow.open(map, marker);
    google.maps.event.addListener(marker, 'click', (e) => {
      this.navigateToHotelDetail(item.hotel_id);
    });
  }
  
  navigateToHotelDetail(hotel_id) {
    this.navCtrl.push('HotelDetailPage', { 'item': hotel_id });
  }

}
