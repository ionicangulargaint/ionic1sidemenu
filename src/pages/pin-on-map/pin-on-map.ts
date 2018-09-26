import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Items } from '../../providers';

declare var google;
let map: any;
let infowindow: any;
let geocoder: any;
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
  latlng:any;
  formattedAddress:any;

  constructor(public navCtrl: NavController) { }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    navigator.geolocation.getCurrentPosition((location) => {
      var myLatlng = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
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
        var latlng = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        reverseGeoCoding(latlng);
      });

      function reverseGeoCoding(latlng){
        geocoder.geocode({ 'location': latlng }, function (results, status) {
          if (status === 'OK') {
            if (results[0]) {
              infowindow.setContent(results[0].formatted_address);
              this.formattedAddress = results[0].formatted_address;
              infowindow.open(map, marker);
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
      }
    }, (error) => {
        console.log(error);
    }, options);
  }

  navigateToDashboard(){
    //alert(this.formattedAddress);
    this.navCtrl.setRoot('DashboardPage');
  }

}
