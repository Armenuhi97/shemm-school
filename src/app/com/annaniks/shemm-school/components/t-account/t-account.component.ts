import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-t-account',
  templateUrl: './t-account.component.html',
  styleUrls: ['./t-account.component.scss']
})
export class TAccountComponent implements OnInit {

  constructor(@Inject('CALENDAR_CONFIG') public calendarConfig) { }

  ngOnInit() {
  }

}
