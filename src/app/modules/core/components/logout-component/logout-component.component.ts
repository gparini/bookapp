import { Component, OnInit } from '@angular/core';
import { RestService } from '../../../../services/rest.service'

@Component({
  selector: 'ba-logout-component',
  templateUrl: './logout-component.component.html',
  styleUrls: ['./logout-component.component.scss']
})
export class LogoutComponentComponent implements OnInit {

  constructor(private restService: RestService) { }

  ngOnInit() {
    var observer = this.restService.logout(undefined);
    observer.subscribe(
      (res) => {
        debugger
      }
    )
  }

}
