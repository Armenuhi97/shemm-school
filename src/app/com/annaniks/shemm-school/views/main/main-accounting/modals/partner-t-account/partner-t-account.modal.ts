import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './partner-t-account.modal.html',
  styleUrls: ['./partner-t-account.modal.scss']
})
export class PartnerTAccountModal implements OnInit {

  public title: string = 'Գործընկերոջ T-հաշիվ';
  constructor(private _dialogRef: MatDialogRef<PartnerTAccountModal>) { }

  ngOnInit() {
  }
  close(event: string) {
    if (event)
      this._dialogRef.close()
  }

}
