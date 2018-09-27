import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Items } from '../../providers';

declare var google;
let options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

@IonicPage()
@Component({
  selector: 'get-directions',
  templateUrl: 'get-directions.html'
})
export class getDirectionsPage {
  @ViewChild('map') mapElement: ElementRef;
  latlng:any;
  formattedAddress:any;

  constructor(public navCtrl: NavController) { }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    navigator.geolocation.getCurrentPosition((location) => {
      var myOriginLatlng = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
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

    }, (error) => {
        console.log(error);
    }, options);
  }

}
