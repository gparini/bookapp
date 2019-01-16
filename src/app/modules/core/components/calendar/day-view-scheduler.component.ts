import { Component, EventEmitter, Injectable, Output } from '@angular/core';
import { CalendarDayViewComponent, CalendarUtils, CalendarDateFormatter, DateAdapter} from 'angular-calendar';
import { DayView, DayViewEvent, GetDayViewArgs } from 'calendar-utils';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../../../../services/rest.service'
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { addHours, startOfDay, addMinutes } from 'date-fns';
import { ServiceRequest } from '../../../../model/service.request'

const EVENT_WIDTH = 150;  

// extend the interface to add the array of users
interface DayViewScheduler extends DayView {
  users: any[];
}

@Injectable()
export class DayViewSchedulerCalendarUtils extends CalendarUtils{

  showHead: boolean = false;
  appParameter: any;
  restService: RestService;

  constructor (dateAdapter: DateAdapter, restService: RestService) {
    super (dateAdapter);
    this.appParameter = restService.appParameter;
    this.restService = restService;
  }

  getDayView(args: GetDayViewArgs): DayViewScheduler {
    const view: DayViewScheduler = {
      ...super.getDayView(args),
      users: []
    };
    this.appParameter["staff"].forEach(({ name }) => {
      // assumes user objects are the same references,
      // if 2 users have the same structure but different object references this will fail
      if (!view.users.includes(name)) {
        view.users.push(name);
      }
    });
    
    // if (this.restService.availableBookingDayObs != undefined) {
    //   this.restService.availableBookingDayObs.subscribe(res => {
    //     view.events = view.events.map(dayViewEvent => {
    //       const index = view.users.indexOf(dayViewEvent.event.meta.user.name);
    //       dayViewEvent.left = index * EVENT_WIDTH; // change the column of the event
    //       return dayViewEvent;
    //     });
    //     view.width = view.users.length * EVENT_WIDTH;
    //   });
    // }
    // } else {
      view.events = view.events.map(dayViewEvent => {
        const index = view.users.indexOf(dayViewEvent.event.meta.user.name);
        dayViewEvent.left = index * EVENT_WIDTH; // change the column of the event
        return dayViewEvent;
      });
      view.width = view.users.length * EVENT_WIDTH;
    // }


    return view;
  }

}

@Component({
  // tslint:disable-line max-classes-per-file
  selector: 'mwl-day-view-scheduler',
  styles: [
    `
      .day-view-column-headers {
        display: flex;
        margin-left: 70px;
      }
      .day-view-column-header {
        width: 150px;
        border: solid 1px black;
        text-align: center;
      }
    `
  ],
  providers: [
    {
      provide: CalendarUtils,
      useClass: DayViewSchedulerCalendarUtils
    },
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ],
  templateUrl: 'day-view-scheduler.component.html'
})
export class DayViewSchedulerComponent extends CalendarDayViewComponent {
  view: DayViewScheduler;

  @Output()
  userChanged = new EventEmitter();

  eventDragged(dayEvent: DayViewEvent, xPixels: number, yPixels: number): void {
      
    if (yPixels !== 0) {
      super.dragEnded(dayEvent, { y: yPixels, x: 0 } as any); // original behaviour
    }
    if (xPixels !== 0) {
      const columnsMoved = xPixels / EVENT_WIDTH;
      const currentColumnIndex = this.view.users.findIndex(
        user => user === dayEvent.event.meta.user
      );
      const newIndex = currentColumnIndex + columnsMoved;
      const newUser = this.view.users[newIndex];
      if (newUser) {
        this.userChanged.emit({ event: dayEvent.event, newUser });
      }
    }
  }


}