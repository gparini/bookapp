import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnInit
} from '@angular/core';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { Service } from 'src/app/shared/model/service';
import { Availability } from 'src/app/shared/model/availability';
import { Subject } from 'rxjs';

@Component({
  selector: 'mwl-demo-component',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'calendar.component.html'
})
export class CalendarComponent implements OnInit{
  view: string = 'month';

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];
  selectedService: Service;
  selecteServiceAvailability: Availability;
  refresh: Subject<any> = new Subject();

  services: Service[] = [
    { id: 'PacchettoA'},
    { id: 'PacchettoB'},
    { id: 'PacchettoC'}
  ];

  ngOnInit() {
    this.retrieveAvailability('PacchettoA');
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
    debugger;
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
    debugger;
    this.selectedService = service;
    this.retrieveAvailability(this.selectedService.id);
    this.refreshView();
  }
}