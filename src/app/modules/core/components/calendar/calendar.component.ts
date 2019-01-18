import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnInit,
  AfterViewInit,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { CalendarEvent, CalendarMonthViewDay, CalendarDateFormatter, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Service } from 'src/app/shared/model/service';
import { Availability } from 'src/app/shared/model/availability';
import { Subject, Observer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import { addHours, startOfDay, addMinutes } from 'date-fns';
import { HttpClient } from '@angular/common/http';
import { Viewbooking } from '../../../../model/viewbooking';
import { ActivatedRoute } from '@angular/router';
import { initNgModule } from '@angular/core/src/view/ng_module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../../../services/rest.service'
import { ServiceRequest } from '../../../../model/service.request'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// const users = [
//   {
//     id: 0,
//     name: 'Slot 1'
//   },
//   {
//     id: 1,
//     name: 'slot 2'
//   },
//   {
//     id: 2,
//     name: 'slot 3'
//   }
// ];



@Component({
  selector: 'mwl-demo-component',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'calendar.component.html',
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ]
})

export class CalendarComponent implements OnInit, AfterViewInit {
  view: string = 'month';
  sub: any;
  appParameter: any;
  mode: String;
  provaGianni: String = 'ciao3';
  show: boolean = true;
  showGianni: boolean = true;
  viewDate: Date = new Date();
  hourSegmentHeight: number = 10;
  selectedService: Service;
  selecteServiceAvailability: Availability;
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  isDataAvailable: boolean;
  activeDayIsOpen: boolean = true;
  messageForm: FormGroup;
  submitted = false;
  success = false;

  //start form
  name: String;
  surname: String;
  phoneNumber: String;
  parameterObserver: Observable<String>;
  //end form

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;

  @ViewChild('modalCancel')
  modalCancel: TemplateRef<any>;

  constructor(public http: HttpClient,
    private route: ActivatedRoute,
    private modal: NgbModal,
    private restService: RestService,
    private formBuilder: FormBuilder) {
    console.log('costruttore');
    this.messageForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    })

    let input: ServiceRequest = new ServiceRequest;
    input.userName = this.name;
    input.userSurname = this.surname;
    input.userPhoneNumber = this.phoneNumber;
    //debugger;
    this.parameterObserver = this.restService.getParameters(input);
    this.parameterObserver.subscribe((res) => {
      //debugger;
      this.appParameter = res["input"];
      this.restService.appParameter = this.appParameter;
      //this.initMonthView()
      console.log(res);

    });
  }

  ngAfterViewInit() {
    console.log("prova");
    switch (this.mode) {
      case 'view':
        this.show = true;
        this.showGianni = true;
        this.provaGianni = 'p1';

        //this.retrieveAvailability('PacchettoA');
        break;
      case 'manage':
        this.show = false;
        this.showGianni = false;
        this.provaGianni = 'p2';
        break;
      default:
        break;
    }
  }

  onSubmit() {
    //debugger;

    let event = this.modalData.event;
    this.submitted = true;

    if (this.messageForm.invalid) {
      return;
    }

    let input: ServiceRequest = new ServiceRequest;
    debugger;
    input.userName = this.name;
    input.userSurname = this.surname;
    input.userPhoneNumber = this.phoneNumber;

    input.bookEndTime = event.meta.book.end.substr(9, 4);
    input.bookDate = event.meta.book.start.substr(0, 8);
    input.bookMessage = "";
    input.bookOfficeId = event.meta.user.officeId;
    input.bookServiceId = event.meta.book.serviceId;
    input.bookStaffId = event.meta.user.id;
    input.bookStaffName = event.meta.user.name;
    input.bookStartTime = event.meta.book.start.substr(9, 4);


    let saveObs = this.restService.saveBooking(input);
    saveObs.subscribe((res) => {
      console.log(res);
    });

    this.success = true;
  }

  onSubmitCancel() {

    let input: ServiceRequest = new ServiceRequest;
    debugger;
    input.bookId = this.modalData.event.meta.book.id;

    let saveObs = this.restService.cancelBooking(input);
    saveObs.subscribe((res) => {
      console.log(res);
    });
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    switch (this.mode) {
      case "view":
         this.modal.open(this.modalCancel, { size: 'lg' });
        break;
      case "manage":
         this.modal.open(this.modalContent, { size: 'lg' });
        break;
      default:
        break;
    }
  }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {

      var modeInput = params['mode']; // (+) converts string 'id' to a number
      this.updateComponent(modeInput)

    });

    this.fetchEvents();
  }

  updateComponent(modeInput) {

    this.mode = modeInput;

  }

  parseDate(str) {
    var y = str.substr(0, 4),
      m = str.substr(4, 2),
      d = str.substr(6, 2)
    return new Date(y, m, d);
  }

  parseHour(str) {
    var y = str.substr(9, 2);
    return y;
  }

  parseMinute(str) {
    var y = str.substr(11, 2);
    return y;
  }

  formatDate(date) {
    var day = date.getDate();
    var dayTempPadde = day.toString().padStart(2, '0');
    var month = date.getMonth();
    var monthTempPadde = month.toString().padStart(2, '0');
    var year = date.getFullYear();
    return "" + year + monthTempPadde + dayTempPadde;
  }

  beforeDayViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    //debugger;
    //this.initDayView();
  }

  initDayView() {
    var date = this.viewDate;
    var formattedDate = this.formatDate(date);

    let input: ServiceRequest = new ServiceRequest;
    input.formattedDate = formattedDate;
    let obs;
    switch (this.mode) {
      case 'view':
        obs = this.restService.viewBookingDay(input);
        break;
      case 'manage':
        obs = this.restService.availableBookingDay(input);
        break;
      default:
        break;
    }


    obs.subscribe((res) => {
      this.getForDayViewAndManage(res);
    });

    return obs;
  }

  getForDayViewAndManage(res) {
    var object = res['input'];

    for (var key in object) {
      console.log(key);
      var book = object[key];

      var start ;
      var end ;
      switch (this.mode) {
        case 'view':
          start = book.date+"."+book.startTime;
          end = book.date+"."+book.endTime;
        break;
        case 'manage':
          start = book.start;
          end = book.end;
        break;
        default:
        break;
      }
      let dateCur = this.parseDate(start);

      var startT = addMinutes(addHours(startOfDay(dateCur), this.parseHour(start)), this.parseMinute(start));
      var endT = addMinutes(addHours(startOfDay(dateCur), this.parseHour(end)), this.parseMinute(end));
      //debugger;
      let staff = this.appParameter.staff;
      staff.forEach(element => {
        var title = element.name;
        if ((book.staffId === element.id && this.mode === 'view') || (book[title] !== undefined && book[title].availableForService))
          this.events.push(
            {
              title: book.username + "\n" + book.service,
              start: startT,
              end: endT,
              meta: {
                user: element,
                book: book
              },
              resizable: {
                beforeStart: true,
                afterEnd: true
              },
              draggable: true
            }
          );
      });
    }
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {

    let obs = this.initMonthView();

    obs.subscribe((res) => {
      body.forEach(day => {
        let dayTemp = day.date.getDate();
        let dayTempPadde = dayTemp.toString().padStart(2, '0');
        if (this.selecteServiceAvailability[dayTempPadde] !== undefined) {
          day.cssClass = 'odd-cell';
        }
      });

      this.refreshView();
    }
    );
  }

  initMonthView() {
    //debugger;
    var date = this.viewDate;
    var formattedDate = this.formatDate(date);
    let input: ServiceRequest = new ServiceRequest;
    input.formattedDate = formattedDate;

    let obs;
    switch (this.mode) {
      case 'view':
        obs = this.restService.viewBookingMonth(input);
        break;
      case 'manage':
        obs = this.restService.availableBookingMonth(input);
        break;
      default:
        break;
    }

    obs.subscribe((res) => {
      //let resp = res.json;
      console.log(res);

      let userTemp = this.appParameter.staff;
      userTemp.forEach(element => {
        var title = element.name;
        var object;
        this.getForMonthViewAndManage(res);

      });
    });

    return obs;
  }

  getForMonthViewAndManage(res): void {
    var object = res['input'];

    var mapMonthBookings = {}
    object.forEach(element => {
      mapMonthBookings[element.day] = null;
    });

    this.selecteServiceAvailability = mapMonthBookings;
  }

  retrieveAvailability(selectedService: String): void {

    switch (selectedService) {
      case 'PacchettoA':
        this.selecteServiceAvailability = { '02': null, '12': null, '13': null, '15': null, '21': null, '25': null };
        break;
      case 'PacchettoB':
        this.selecteServiceAvailability = { '03': null, '04': null, '05': null };
        break;
      case 'PacchettoC':
        this.selecteServiceAvailability = { '06': null, '07': null, '08': null };
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

  refreshView(): void {
    debugger;
    this.refresh.next();
  }

  fetchEvents(): void {
    let obs = this.initDayView();
    this.isDataAvailable = false;
    obs.subscribe(() =>
      this.isDataAvailable = true);
  }
}