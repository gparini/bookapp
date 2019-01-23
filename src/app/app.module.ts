import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarComponent } from './modules/core/components/calendar/calendar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns'
import { DemoUtilsModule } from './modules/core/components/demo-utils/module';
import { DemoModule } from './modules/core/components/demo/module';
import { FlatpickrModule } from 'angularx-flatpickr';
import { DayViewSchedulerComponent } from './modules/core/components/calendar/day-view-scheduler.component';
import { MatRadioModule } from '@angular/material';
import { RegistrationComponentComponent } from './modules/core/components/registration-component/registration-component.component';
import { LoginComponentComponent } from './modules/core/components/login-component/login-component.component';
import { MyMaterialModule } from  './material.module';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    DayViewSchedulerComponent,
    RegistrationComponentComponent,
    LoginComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    DemoUtilsModule,
    DemoModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    FlatpickrModule.forRoot(),
    MatRadioModule,
    MyMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
