import { Injectable } from '@angular/core';
import { ServiceRequest } from '../model/service.request';
import { Viewbooking } from '../model/viewbooking';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};


@Injectable({
  providedIn: 'root'
})
export class RestService {

  postStatus : any;
  appParameter : any;
  viewBookingMonthObservable: any;
  availableBookingMonthObservale: any;
  availableBookingDayObs: any;
  loginObservable: any;

  constructor(public http: HttpClient) { }

  viewBookingMonth (req: ServiceRequest) {
    this.viewBookingMonthObservable = this.http.get<string>('http://localhost:3000/booking/viewMonth/'+req.formattedDate);
    return this.viewBookingMonthObservable;
  }

  viewBookingDay (req: ServiceRequest) {
    return this.http.get<string>('http://localhost:3000/booking/viewDay/'+req.formattedDate);
  }

  cancelBooking (req: ServiceRequest) {
    return this.http.delete<string>('http://localhost:3000/booking/cancelBooking/'+req.bookId);
  }

  availableBookingDay (req: ServiceRequest) {
    debugger;
    this.availableBookingDayObs = this.http.get<string>('http://localhost:3000/booking/availableBooking/'+req.formattedDate+"/"+req.bookServiceId);;
    return this.availableBookingDayObs;
  }
  
  availableBookingMonth (req: ServiceRequest) {
    this.availableBookingDayObs = this.http.get<string>('http://localhost:3000/booking/availableBooking/'+req.formattedDate+"/"+req.bookServiceId);;
    return this.availableBookingDayObs;
  }

  saveBooking (req: ServiceRequest) {
    return this.http.post('http://localhost:3000/booking/saveBooking', JSON.stringify(req), httpOptions);
  }

  getParameters (req: ServiceRequest) {
    return this.http.get<string>('http://localhost:3000/parameters/parameters');
  }

  login (req: ServiceRequest) {
    this.loginObservable = this.http.post('http://localhost:3000/login', JSON.stringify(req), httpOptions);
    return this.loginObservable;
  }

  logout (req: ServiceRequest) {
    return this.http.get<string>('http://localhost:3000/logout');
  }
}
