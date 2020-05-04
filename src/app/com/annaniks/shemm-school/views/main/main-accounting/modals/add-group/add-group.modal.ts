import { Component, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MainService } from '../../../main.service';
import { SelectByModal } from 'src/app/com/annaniks/shemm-school/shared/modals';
import { AppService } from 'src/app/com/annaniks/shemm-school/services';
import { Group } from 'src/app/com/annaniks/shemm-school/models/global.models';

@Component({
    selector: 'add-group-modal',
    templateUrl: 'add-group.modal.html',
    styleUrls: ['add-group.modal.scss']
})
export class AddGroupModal {
    public formGroup: FormGroup;
    public title: string;
    public modalParams = { tabs: ['Կոդ', 'Անվանում', 'Կուտակիչ'], title: 'Գործընկերների խմբեր', keys: ['id', 'name', 'accumulator'] }
    constructor(private _fb: FormBuilder,
        private _mainService: MainService, private _appService: AppService,
        @Inject(MAT_DIALOG_DATA) private _data: { title: string, array: Group[] },
        private _dialogRef: MatDialogRef<AddGroupModal>) { }
    ngOnInit() {
        this.title = this._data.title
        this._validate()
    }
    private _validate() {
        this.formGroup = this._fb.group({
            accumulator: [null],
            name: [null, Validators.required]
        })
    }
    public close() {
        this._dialogRef.close(false)
    }
    public addGroup() {
        if (this.formGroup.valid)
            this._mainService.addByUrl('group', {
                name: this.formGroup.get('name').value, accumulator: this._appService.checkProperty(this.formGroup.get('accumulator').value, 'id')
            }).subscribe(() => {
                this._dialogRef.close(true)
            })
    }
    public setValue(event) {
            this.formGroup.get('accumulator').setValue(event);
    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.formGroup, controlName, property)
    }
    get getModalName() {
        return SelectByModal
    }
    get groupArray() {
        return this._data.array
    }
    ngOnDestroy() { }
}