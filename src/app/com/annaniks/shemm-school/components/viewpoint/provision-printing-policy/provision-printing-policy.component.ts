import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-provision-printing-policy',
  templateUrl: './provision-printing-policy.component.html',
  styleUrls: ['./provision-printing-policy.component.scss']
})
export class ProvisionPrintingPolicyComponent implements OnInit {
  @Input('title') public tabTitle: string;

  constructor() { }

  ngOnInit() {
  }

}
