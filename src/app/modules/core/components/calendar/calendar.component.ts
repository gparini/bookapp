import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { CalendarEvent, CalendarMonthViewDay,   CalendarDateFormatter, CalendarEventTimesChangedEvent  } from 'angular-calendar';
import { Service } from 'src/app/shared/model/service';
import { Availability } from 'src/app/shared/model/availability';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import { addHours, startOfDay, addMinutes } from 'date-fns';
import { HttpClient } from '@angular/common/http';
import { Viewbooking } from './viewbooking';

const users = [
  {
    id: 0,
    name: 'Slot 1'
  },
  {
    id: 1,
    name: 'slot 2'
  },
  {
    id: 2,
    name: 'slot 3'
  }
];



@Component({
  selector: 'mwl-demo-component',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'calendar.component.html',
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ]
})

export class CalendarComponent implements OnInit{
  view: string = 'month';

  viewDate: Date = new Date();
  hourSegmentHeight: number = 10;

  selectedService: Service;
  selecteServiceAvailability: Availability;
  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  services: Service[] = [
    { id: 'PacchettoA'},
    { id: 'PacchettoB'},
    { id: 'PacchettoC'}
  ];

  constructor(public http: HttpClient) { 
    console.log('costruttore');
  }

  ngOnInit() {
    this.retrieveAvailability('PacchettoA');
    this.initDayView();
  }

  initDayView(){
    
    let obs = this.http.get<Viewbooking>('http://localhost:3000/booking/viewbooking');
    debugger;
    //this.events = []; 
    obs.subscribe((res) => {
      //let resp = res.json;
      debugger;
      console.log(res);

      
      let userTemp = users;
      userTemp.forEach(element => {
        var title = element.name;
        var object = res['results'][title];
        
        for (var key in object) {
          console.log(key);
          debugger;
          this.events.push(
            {
              title: 'Gianni Parini',
              start: addHours(startOfDay(new Date()), 10),
              meta: {
                user: users[0]
              },
              resizable: {
                beforeStart: true,
                afterEnd: true
              },
              draggable: true
            }
          );
        }

      });

    });

  }

  refreshView(): void {

    this.refresh.next();
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {

    body.forEach(day => {
      let dayTemp = day.date.getDate();
      let dayTempPadde = dayTemp.toString().padStart(2, '0');
      if ( this.selecteServiceAvailability[dayTempPadde] !== undefined ) {
        day.cssClass = 'odd-cell';
      }
    });
  }

  retrieveAvailability(selectedService: String): void {
    
    switch (selectedService) {
      case 'PacchettoA':
        this.selecteServiceAvailability = {'02':null,'12':null,'13':null,'15':null,'21':null,'25':null};
        break;
      case 'PacchettoB':
        this.selecteServiceAvailability = {'03':null,'04':null,'05':null};
        break;
      case 'PacchettoC':
        this.selecteServiceAvailability = {'06':null,'07':null,'08':null};
        break;
      default:
        break;
    }
  }
  
  onSelect(service: Service): void {
    this.selectedService = service;
    this.retrieveAvailability(this.selectedService.id);
    this.refreshView();
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.events = [...this.events];
  }

  userChanged({ event, newUser }) {
    event.color = newUser.color;
    event.meta.user = newUser;
    this.events = [...this.events];
  }
}