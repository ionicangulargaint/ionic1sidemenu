import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { CommonService } from '../../providers';
import { Items } from '../../providers';

declare var google;
let map: any;
let infowindow: any;
let geocoder: any;
let formattedAddress: any;
let selectedlatitude: any;
let selectedlongitude: any;
let options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

@IonicPage()
@Component({
  selector: 'pin-on-map',
  templateUrl: 'pin-on-map.html'
})
export class pinOnMapPage {
  @ViewChild('map') mapElement: ElementRef;
  latlng: any;

  constructor(public navCtrl: NavController, public geolocation: Geolocation,public commonService: CommonService,) { }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    this.commonService.createLoader();
    this.commonService.loading.present().then(() => {
    this.geolocation.getCurrentPosition().then((res) => {
      selectedlatitude = res.coords.latitude;
      selectedlongitude = res.coords.longitude;
      this.commonService.loading.dismiss();
      var myLatlng = new google.maps.LatLng(res.coords.latitude, res.coords.longitude);
      map = new google.maps.Map(this.mapElement.nativeElement, {
        center: myLatlng,
        zoom: 15
      });

      infowindow = new google.maps.InfoWindow();
      geocoder = new google.maps.Geocoder;

      var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        draggable: true,
        title: "Drag me!"
      });

      reverseGeoCoding(myLatlng);

      google.maps.event.addListener(marker, 'dragend', function (event) {
        selectedlatitude = event.latLng.lat();
        selectedlongitude = event.latLng.lng();
        var latlng = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        reverseGeoCoding(latlng);
      });

      function reverseGeoCoding(latlng) {
        geocoder.geocode({ 'location': latlng }, function (results, status) {
          if (status === 'OK') {
            if (results[0]) {
              infowindow.setContent(results[0].formatted_address);
              formattedAddress = results[0].formatted_address;
              infowindow.open(map, marker);
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
      }
    }).catch((error) => {
      window.alert('Error getting location ' + error);
      this.commonService.loading.dismiss();
    });
  });
  }

  navigateToDashboard() {
    var obj = {
      address: formattedAddress,
      latitude: selectedlatitude,
      longitude: selectedlongitude
    }
    console.log(obj)
    this.navCtrl.setRoot('DashboardPage',{ 'mapSearchObj': obj });
  }

}
