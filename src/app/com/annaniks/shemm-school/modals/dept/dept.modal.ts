import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MainService } from '../../views/main/main.service';
import { LoadingService, AppService } from '../../services';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'dept-modal',
    templateUrl: 'dept.modal.html',
    styleUrls: ['dept.modal.scss']
})
export class DeptModal {
    public title: string = ''
    public items = [];
    public totalPaidMoney: number = 0;
    public totalSum: number = 0

    constructor(@Inject(MAT_DIALOG_DATA) private _data,
        private _dialogRef: MatDialogRef<DeptModal>,
        private _fb: FormBuilder,
        private _mainService: MainService,
        private _loadingService: LoadingService,
        private _appService: AppService,
        private _messageService: MessageService,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        @Inject('URL_NAMES') private _urls) {
        this._setEntity()

    }
    ngOnInit() {
    }
    private _setEntity() {
        this.items=[]
        this.items = this._data.items;
        this.totalSum = 0;
        this.totalPaidMoney = 0;        
        this.items.forEach((item) => {
            this.totalSum += item.deptSum;
            this.totalPaidMoney += item.paidMoney;
            if (!item.paidMoney.value && item.paidMoney.value !== 0) {                
                item['paidMoney'] = new FormControl(item.paidMoney, [Validators.max(item.deptSum), Validators.min(0)])
            }
        })
    }
    public changePaidSum() {
        this.totalPaidMoney = 0
        this.items.forEach((item) => {        
            
            this.totalPaidMoney += item.paidMoney.value;
        })
    }


    public focus(item, controlName: string): void {
        if (item[controlName].value == 0)
            item[controlName].setValue(null)
    }

    public blur(item, controlName: string): void {
        if (item[controlName].value == null || item[controlName].value == 0)
            item[controlName].setValue(0)
    }


    public setModalParams(title: string, keys: Array<string>, tabsArray: Array<string>) {
        let modalParams = { tabs: tabsArray, title: title, keys: keys };
        return modalParams
    }

    public close() {
        this._dialogRef.close(false)
    }
    public save() {
        let amount = 0;        
        for (let data of this.items) {
            if (data.paidMoney.valid) {
                if (data.paidMoney.value) {
                    amount += data.paidMoney.value;                    
                }                         
            } else {
                return
            }
        }                
        this._dialogRef.close({ amount: amount,array:this.items })
    }
}