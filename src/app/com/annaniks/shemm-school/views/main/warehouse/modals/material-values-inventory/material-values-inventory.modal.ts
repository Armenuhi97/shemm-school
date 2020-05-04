import { Component, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'material-values-inventory-modal',
    templateUrl: 'material-values-inventory.modal.html',
    styleUrls: ['material-values-inventory.modal.scss']
})
export class MaterialValuesInventoryModal {
    public title: string;
    public materialValuesGroup: FormGroup;
    public activeTab: string;
    public tabsItem: string[] = ['Ընդհանուր', 'Հանձնաժողովի անդամներ']
    constructor(private _dialogRef: MatDialogRef<MaterialValuesInventoryModal>,
        @Inject(MAT_DIALOG_DATA) private _data: { label: string },
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        private _fb: FormBuilder) {
        this.title = this._data.label
    }
    ngOnInit() {
        this._validate()
    }
    public close(event) {
        if (event) {
            this._dialogRef.close()
        }
    }
    private _validate(){
        this.materialValuesGroup=this._fb.group({
            date:[null,Validators.required],
            folderNumber:[null,Validators.required],
            warehouse:[null,Validators.required],
            material_values_group:[null]
        })
    }
    public getActiveTab(event:string){
        this.activeTab=event
    }
}