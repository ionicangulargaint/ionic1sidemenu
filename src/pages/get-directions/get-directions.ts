import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController,public geolocation: Geolocation) { }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((res) => {
      var myOriginLatlng = new google.maps.LatLng(res.coords.latitude, res.coords.longitude);
      var myDestinationLatlng = new google.maps.LatLng(28.7041, 77.1025);

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
