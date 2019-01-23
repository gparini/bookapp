import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './modules/core/components/calendar/calendar.component';
import { RegistrationComponentComponent  } from './modules/core/components/registration-component/registration-component.component';
import { LoginComponentComponent  } from './modules/core/components/login-component/login-component.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
      { path: 'register', component: RegistrationComponentComponent },
      { path: 'login', component: LoginComponentComponent },
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
