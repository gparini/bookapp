import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { ServiceRequest } from '../../../../model/service.request'
import { Router } from '@angular/router';
import { Subject, Observer, Observable } from 'rxjs';


@Component({
  selector: 'ba-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.scss']
})
export class LoginComponentComponent implements OnInit {

  userId: String;
  password: String;
  loginObserver: any;

  constructor(private restService: RestService, private router: Router) { }

  ngOnInit() {
  }

  login(): void {
    debugger;
    console.log();
    let input: ServiceRequest = new ServiceRequest;
    input.userId = this.userId;
    input.password = this.password;
    this.loginObserver = this.restService.login(input);
    this.loginObserver.subscribe(
      (res) => {
        debugger;
        if (res.esito === 'OK') {
          this.router.navigate(['/calendarView/view'])
        }
      },
      (err) => {
        debugger
      });
  }

}
