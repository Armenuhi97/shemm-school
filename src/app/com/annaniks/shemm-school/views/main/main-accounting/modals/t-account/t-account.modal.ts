import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 't-account',
  templateUrl: './t-account.modal.html',
  styleUrls: ['./t-account.modal.scss']
})
export class TAccountModal implements OnInit {

  public title: string = 'T-հաշիվ';
  constructor(private _dialogRef: MatDialogRef<TAccountModal>) { }

  ngOnInit() {
  }
  close(event: string) {
    if (event)
      this._dialogRef.close()
  }
}
