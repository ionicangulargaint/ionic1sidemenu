import { Component,ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Items } from '../../providers';

declare var google;
let map: any;
let infowindow: any;
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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public items: Items,
    public geolocation: Geolocation
  ) { }

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    this.geolocation.getCurrentPosition().then((res) => {
      console.log(res);
      map = new google.maps.Map(this.mapElement.nativeElement, {
        center: {lat: res.coords.latitude, lng: res.coords.longitude},
        zoom: 15
      });
  
      infowindow = new google.maps.InfoWindow();
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: {lat: res.coords.latitude, lng: res.coords.longitude},
        radius: 1000,
        type: ['store']
      }, (results,status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            this.createMarker(results[i]);
          }
        }
      });
    }).catch((error) => {
      window.alert('Error getting location '+ error);
    });
  }

  createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: placeLoc
    });
  
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }
  
}
