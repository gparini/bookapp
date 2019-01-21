import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './modules/core/components/calendar/calendar.component';
import { DemoComponent } from './modules/core/components/demo/component';

const routes: Routes = [
  {
    path: 'calendarView/:mode',
    component: CalendarComponent
  },
  {
    path: 'calendarManage/:mode',
    component: CalendarComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
