import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'ba-user-test',
  templateUrl: './user-test.component.html',
  styleUrls: ['./user-test.component.scss']
})
export class UserTestComponent implements OnInit {

  result: Object;

  constructor(public http: HttpClient) { 
    console.log('costruttore');
  }

  ngOnInit() {
    let obs = this.http.get('http://localhost:3000/users');
    //debugger;
    obs.subscribe(() => {
      //debugger;

      console.log('ricevuto messaggio')
    });
   
  }

}
