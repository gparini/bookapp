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
import { Router } from '@angular/router';
import { delay, share } from 'rxjs/operators';

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
  selectedService: String;
  selecteServiceAvailability: Availability;
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  isDataAvailable: boolean;
  activeDayIsOpen: boolean = true;
  messageForm: FormGroup;
  submitted = false;
  success = false;
  serviceList = [];
  favoriteSeason: string;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];
  errorMessage: string;
  eventObservable$: Observable<{}>;

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

  @ViewChild('modalService')
  modalService: TemplateRef<any>;


  @ViewChild('modalError')
  modalError: TemplateRef<any>;

  constructor(public http: HttpClient,
    private route: ActivatedRoute,
    private modal: NgbModal,
    private restService: RestService,
    private formBuilder: FormBuilder,
    private router: Router) {
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
    this.parameterObserver.subscribe(
      (res) => {
        debugger;
        if (res['esito'] === 'KO') {
          this.router.navigate(['/login'])
        }

        this.appParameter = res["input"];
        this.restService.appParameter = this.appParameter;
        this.serviceList = [];

        var map = this.appParameter.service;
        var serviceList = [];
        //debugger;
        Object.keys(map).forEach(function (key) {
          var elem = map[key];
          serviceList.push(elem);
        });
        this.serviceList = serviceList;

        //this.initMonthView()
        console.log(res);
        //debugger;
        if (this.mode === 'manage') {
          this.modal.open(this.modalService, { size: 'lg' });
        }
      },
      (err) => {
        this.modal.open(this.modalError, { size: 'lg' });
      });
  }

  ngAfterViewInit() {
    debugger;
    switch (this.mode) {
      case 'view':
        break;
      case 'manage':
        break;
      default:
        break;
    }

    this.fetchEvents();
    this.refreshView();
  }

  onSubmit() {
    //debugger;

    let event = this.modalData.event;
    this.submitted = true;

    if (this.messageForm.invalid) {
      return;
    }

    let input: ServiceRequest = new ServiceRequest;
    //debugger;
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
      if (res["input"] !== "OK") {
        this.errorMessage = res["input"]["err"].code;
        this.modal.dismissAll("");
        this.modal.open(this.modalError, { size: 'lg' });
      }
    },
      (err) => {
        this.errorMessage = err;
        this.modal.open(this.modalError, { size: 'lg' });
      });

    this.success = true;
  }

  onSubmitCancel() {

    let input: ServiceRequest = new ServiceRequest;
    //debugger;
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

    //this.fetchEvents();
    this.isDataAvailable = true;
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

  initDayView() {
    var date = this.viewDate;
    var formattedDate = this.formatDate(date);

    let input: ServiceRequest = new ServiceRequest;
    input.formattedDate = formattedDate;
    input.bookServiceId = this.selectedService;
    let obs;
    debugger
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

    this.eventObservable$ = obs.pipe(share());

    obs.subscribe((res) => {
      this.getForDayViewAndManage(res);
    });

    return obs;
  }

  getForDayViewAndManage(res) {
    var object = res['input'];
    this.events = [];

    for (var key in object) {
      var book = object[key];

      var start;
      var end;
      switch (this.mode) {
        case 'view':
          start = book.date + "." + book.startTime;
          end = book.date + "." + book.endTime;
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
        debugger;
        if ((book.staffId === element.id && this.mode === 'view') || (book[title] !== undefined && book[title].availableForService))
          this.events.push(
            {
              title: "Ore: " + book.slot + " " + element.name,
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
    this.refresh.next();
  }

  fetchEvents(): void {
    let obs = this.initDayView();
    this.isDataAvailable = false;
    obs.subscribe(() =>
      this.isDataAvailable = true);
  }

  updateOnclose(): void {
    // this.fetchEvents();
    // this.refreshView();
  }
}