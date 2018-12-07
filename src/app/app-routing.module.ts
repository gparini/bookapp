import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserTestComponent } from './modules/core/components/user-test/user-test.component';
import { CalendarComponent } from './modules/core/components/calendar/calendar.component';
import { DemoComponent } from './modules/core/components/demo/component';

const routes: Routes = [
  {
    path: 'usertest',
    component: UserTestComponent
  },
  {
    path: 'calendarView/:mode',
    component: CalendarComponent
  },
  {
    path: 'calendarManage/:mode',
    component: CalendarComponent
  },
  {
    path: 'demo',
    component: DemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
