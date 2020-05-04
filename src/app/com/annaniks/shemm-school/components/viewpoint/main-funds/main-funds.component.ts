import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MainService } from '../../../views/main/main.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AddProvisionsModal } from '../../../views/main/salary/modals';

@Component({
  selector: 'app-main-funds',
  templateUrl: './main-funds.component.html',
  styleUrls: ['./main-funds.component.scss']
})

export class MainFundsComponent implements OnInit {
  @Input('title') public tabTitle: string;
  public mainFundsGroup: FormGroup;
  constructor(
    private _dialogRef: MatDialogRef<AddProvisionsModal>,
    private _fb: FormBuilder,
    private _mainService: MainService,
    @Inject('URL_NAMES') private _urls
  ) {
    this._validate()
  }

  private _validate() {
    this.mainFundsGroup = this._fb.group({
      regularPropertyNumber: [null],
      creditDebtsReceivedHM: [null],
      capitalizedExpensesOnHM: [null],
      revaluationValueChangeOfHM: [null],
      revaluationValueExpenseAccountOfHM: [null]
    });
  }

  ngOnInit() {

  }

  public addMainFaund() {
    console.log(this.mainFundsGroup.value);

    return this._mainService.updateJsonByUrl(this._urls.provisionMainFundsUrl, this.mainFundsGroup.value)
      .subscribe(data => {
        console.log('mainFaund', data)
      })
  }

  public close(): void {
    this._dialogRef.close()
  }


}

