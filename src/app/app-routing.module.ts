import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserTestComponent } from './modules/core/components/user-test/user-test.component';

const routes: Routes = [
  {
    path: 'usertest',
    component: UserTestComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
