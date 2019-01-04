import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnInit,
  AfterViewInit,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { CalendarEvent, CalendarMonthViewDay,   CalendarDateFormatter, CalendarEventTimesChangedEvent  } from 'angular-calendar';
import { Service } from 'src/app/shared/model/service';
import { Availability } from 'src/app/shared/model/availability';
import { Subject } from 'rxjs';
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

export class CalendarComponent implements OnInit, AfterViewInit{
  view: string = 'month';
  sub: any;
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
  activeDayIsOpen: boolean = true;
  messageForm: FormGroup;
  submitted = false ;
  success = false; 

  //start form
  name: String;
  surname: String;
  //end form

  services: Service[] = [
    { id: 'PacchettoA'},
    { id: 'PacchettoB'},
    { id: 'PacchettoC'}
  ];
  
  modalData: {
    action: string;
    event: CalendarEvent;
  };

  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;

  constructor(public http: HttpClient, 
              private route: ActivatedRoute,
              private modal: NgbModal,
              private restService: RestService,
              private formBuilder: FormBuilder) { 
    console.log('costruttore');
    this.messageForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required]
    })
  }

  ngAfterViewInit(){
    console.log("prova");
    switch (this.mode) {
      case 'view':
        this.show = true;
        this.showGianni = true;
        this.provaGianni = 'p1';
        
        this.retrieveAvailability('PacchettoA');
        this.initDayView();
        break;
      case 'manage':
      this.show = false;
      this.showGianni = false;
      this.provaGianni = 'p2';
      this.initDayView();
        break;     
      default:
        break;
    }
  }

  onSubmit() { 
    debugger; 
    this.submitted = true;

    if (this.messageForm.invalid) {
      return;
    }

    let input: ServiceRequest = new ServiceRequest;
    input.name = this.name;
    input.surname = this.surname;
    this.restService.saveBooking(input);

    this.success = true;
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  ngOnInit() {
    
    this.sub = this.route.params.subscribe(params => {
      
      var modeInput = params['mode']; // (+) converts string 'id' to a number
      this.updateComponent(modeInput)

    });
  }

  updateComponent(modeInput) {

         this.mode = modeInput;

  }

  parseDate(str) {
    var y = str.substr(0,4),
        m = str.substr(4,2),
        d = str.substr(6,2)
    return new Date(y,m,d);
}

parseHour(str) {
  var y = str.substr(9,2);
  return y;
}

parseMinute(str) {
  var y = str.substr(11,2);
  return y;
}

formatDate(date) {
  var day = date.getDate();
  var dayTempPadde = day.toString().padStart(2, '0');
  var month = date.getMonth();
  var monthTempPadde = month.toString().padStart(2, '0');
  var year = date.getFullYear();
  return ""+year + monthTempPadde + dayTempPadde;
}

  initDayView(){

    var date = new Date();
    var formattedDate = this.formatDate(date);
    
    let input: ServiceRequest = new ServiceRequest;
    input.formattedDate = formattedDate;
    let obs ;
    switch (this.mode) {
      case 'view':
        obs = this.restService.viewBooking(input);
        break;
      case 'manage':
        obs = this.restService.availableBooking(input);
        break;
      default:
        break;
    }
    
    //debugger;
    //this.events = []; 
    obs.subscribe((res) => {
      //let resp = res.json;
      //debugger;
      console.log(res);

      
      let userTemp = users;
      userTemp.forEach(element => {
        var title = element.name;
        var object;
        switch (this.mode) {
          case 'view':
            this.getForView(res,title,element);
            break;
            case 'manage':
            this.getForManage(res,title,element);
            break;
          default:
            break;
        }
       

      });

    });

  }

  getForManage(res,title,element) {
    var object = res['results'];
            
    for (var key in object) {
      console.log(key);
      var book = object[key];
      var start = book.start;
      var end = book.end;
      let dateCur = this.parseDate(start);

      var startT = addMinutes(addHours(startOfDay(dateCur), this.parseHour(start)), this.parseMinute(start));
      var endT = addMinutes(addHours(startOfDay(dateCur), this.parseHour(end)), this.parseMinute(end));
      //debugger;
      this.events.push(
        {
          title: book.username + "\n" + book.service,
          start: startT,
          end: endT,
          meta: {
            user: element
          },
          resizable: {
            beforeStart: true,
            afterEnd: true
          },
          draggable: true
        }
      );
    }
  }

  getForView(res,title, element): void {
    var object = res['results'][title];
        
    //ciclo per ogni dipendente
    for (var key in object) {
      console.log(key);
      var book = object[key];
      var start = book.start;
      var end = book.end;
      let dateCur = this.parseDate(start);

      var startT = addMinutes(addHours(startOfDay(dateCur), this.parseHour(start)), this.parseMinute(start));
      var endT = addMinutes(addHours(startOfDay(dateCur), this.parseHour(end)), this.parseMinute(end));
      //debugger;
      this.events.push(
        {
          title: book.username + "\n" + book.service,
          start: startT,
          end: endT,
          meta: {
            user: element
          },
          resizable: {
            beforeStart: true,
            afterEnd: true
          },
          draggable: true
        }
      );
    }
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