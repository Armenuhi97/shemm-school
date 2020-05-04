import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'select-addition-retention-modal',
    templateUrl: 'select-addition-retention.modal.html',
    styleUrls: ['select-addition-retention.modal.scss']
})
export class SelectAdditionRetentionModal {
    public title: string;
    public additionRetentionArray = [{
        code: '920', name: 'Հաստիք',
        reportCardCode: '01', coficient: 0, incomeType: 'Աշխատավարձ(բազային եկամուտ)',
        countdown: true, isWithheldIncomeTax: false
    },
    {
        code: '921', name: 'Հաստիք2',
        reportCardCode: '02', coficient: 0, incomeType: 'Աշխատավարձ(բազային եկամուտ)',
        countdown: true, isWithheldIncomeTax: false
    }]
    constructor(private _dialogRef: MatDialogRef<SelectAdditionRetentionModal>,
        @Inject(MAT_DIALOG_DATA) private _date,
    ) { }

    ngOnInit() {
        this.title = 'Հավելում/պահում';
    }

    public close(event) {
        if (event)
            this._dialogRef.close()
    }
    public select(item) {
        this._dialogRef.close(item)
    }
}