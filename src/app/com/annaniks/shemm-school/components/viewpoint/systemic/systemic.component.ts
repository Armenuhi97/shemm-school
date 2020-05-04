import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AddProvisionsModal } from '../../../views/main/salary/modals';

@Component({
  selector: 'app-systemic',
  templateUrl: './systemic.component.html',
  styleUrls: ['./systemic.component.scss']
})
export class SystemicComponent implements OnInit {
  @Input('title') public tabTitle: string;


  public systemicGroup: FormGroup
  constructor(
    private _dialogRef: MatDialogRef<AddProvisionsModal>,
    private _fb: FormBuilder
  ) { this._validate() }

  public days = [
    { day: 1 },
    { day: 2 },
    { day: 3 },
    { day: 4 }
  ]

  ngOnInit() {
  }


  private _validate() {
    this.systemicGroup = this._fb.group({
      autoCreateBackupCopy: [true],
      limitOfDay: 1,
      localCopy: this._fb.group({
        autoExportSpecifiedLibraryCreatingBackup: [null],
        enterLibraryValue: []
      }),
      onlineCopy: this._fb.group({
        autoExportDropboxCreatingBackup: [false],
        joinDropboxCloudStorage: []
      }),
      maximumTimeForReportingRequest: [120],
      participatesInDataExchangeProcessTP: [false]
    })
  }


  public addProvisionSystemic() {
    console.log(this.systemicGroup.value)
  }

  public close(): void {
    this._dialogRef.close()
  }

}
