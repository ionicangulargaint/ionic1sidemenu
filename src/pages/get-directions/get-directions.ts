import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;


@IonicPage()
@Component({
  selector: 'get-directions',
  templateUrl: 'get-directions.html'
})
export class GetDirectionsPage {
  @ViewChild('map') mapElement: ElementRef;
  latlng:any;
  formattedAddress:any;

  constructor(public navParams: NavParams, public navCtrl: NavController,public geolocation: Geolocation) {
    this.latlng = this.navParams.get("hotelDetails");
   }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((res) => {
      var myOriginLatlng = new google.maps.LatLng(res.coords.latitude, res.coords.longitude);
      var myDestinationLatlng = new google.maps.LatLng(this.latlng.lat, this.latlng.long);

      var directionsService = new google.maps.DirectionsService();
      var directionsDisplay = new google.maps.DirectionsRenderer();

      var map = new google.maps.Map(this.mapElement.nativeElement, {
        center: myOriginLatlng,
        zoom: 15
      });

      directionsDisplay.setMap(map);
      var request = {
        origin: myOriginLatlng,
        destination: myDestinationLatlng,
        travelMode: 'DRIVING'
      };
      directionsService.route(request, function(result, status) {
        if (status == 'OK') {
          directionsDisplay.setDirections(result);
        }
      });

    }).catch((error) => {
      window.alert('Error getting location '+ error);
    });
  }

}
