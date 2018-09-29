import { Injectable } from '@angular/core';

@Injectable()
export class CommonService {
  rooms: any;
  adult: any;
  children: any;

  constructor() {
    this.rooms = 1;
    this.adult = 1;
    this.children = 0;
  }

  setGuestDetails(rooms, adult,children) {
    this.rooms = rooms;
    this.adult = adult;
    this.children = children;
  }

  getGuestDetails() {
    var obj = {
      rooms:this.rooms,
      adult:this.adult,
      children:this.children
    };
    return obj;
  }

}
