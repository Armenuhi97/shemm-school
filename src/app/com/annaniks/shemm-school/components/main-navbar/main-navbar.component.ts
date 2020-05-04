import { Component, OnInit, Input } from '@angular/core';
import { IMenu } from '../../models/global.models';

@Component({
  selector: 'main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrls: ['./main-navbar.component.scss']
})
export class MainNavbarComponent implements OnInit {
  public menuItem: IMenu;
  @Input('menuItem')
  set getMenuItem($event: IMenu) {
    this.menuItem = $event
  }
  constructor() { }

  ngOnInit() {
  }

}
