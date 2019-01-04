import { Injectable } from '@angular/core';
import { ServiceRequest } from '../model/service.request';
import { Viewbooking } from '../model/viewbooking';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  postStatus : any;

  constructor(public http: HttpClient) { }

  viewBooking (req: ServiceRequest) {
    return this.http.get<Viewbooking>('http://localhost:3000/booking/viewBooking/'+req.formattedDate);
  }

  cancelBooking (req: ServiceRequest) {
    return this.http.get<Viewbooking>('http://localhost:3000/booking/cancelBooking/'+req.bookingId);
  }

  availableBooking (req: ServiceRequest) {
    return this.http.get<Viewbooking>('http://localhost:3000/booking/availableBooking/'+req.formattedDate);;
  }

  saveBooking (req: ServiceRequest) {
    return this.http.post('http://localhost:3000/booking/saveBooking',req);
  }
}
