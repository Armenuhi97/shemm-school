import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-operation-imported-from-bank',
  templateUrl: './operation-imported-from-bank.modal.html',
  styleUrls: ['./operation-imported-from-bank.modal.scss']
})
export class OperationImportedFromBankModal implements OnInit {

  public title:string;
  public filesGroup:FormGroup
  constructor(private _dialogRef: MatDialogRef<OperationImportedFromBankModal>,
      private _fb: FormBuilder,
      @Inject(MAT_DIALOG_DATA) private _date: { label: string },
      @Inject('CALENDAR_CONFIG') public calendarConfig) { }
      
  ngOnInit() {
      this.title = this._date.label;
      this._validate()
  }
  private _validate(){
      this.filesGroup=this._fb.group({
          startDate:[null,Validators.required],
          endDate:[null,Validators.required],
          settlement_account:[null],
          currency:[null]
      })
  }
  public close(event) {
      if (event)
          this._dialogRef.close()
  }
}
