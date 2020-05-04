import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { SelectByModal } from '../../modals';
import { AppService } from '../../../services';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-modal-dropdown',
    templateUrl: 'modal-dropdown.component.html',
    styleUrls: ['modal-dropdown.component.scss']
})
export class ModalDropdownComponent {
    private _modalName;
    public array: Array<any> = [];
    public property: string;
    private _modalParams;
    public filterArray: Array<Object> = []
    public inputValue = new FormControl(null)
    private _selectObject;
    public isDisabled: boolean = false
    private _property: string;
    private _isSelect: boolean = false
    private _inputProperty: string;
    private _lastValue;
    @ViewChild('autocomplete', { static: false }) public autoCompleteElement: ElementRef
    @Input('modalName')
    set setModalName($event) {
        this._modalName = $event;
    }
    @Input('inputProperty')
    set setInputProperty($event) {
        this._inputProperty = $event
    }
    @Input('isDisabledInput')
    set isDisabledInput($event: boolean) {
        this.isDisabled = $event
    }

    @Input('modalParams')
    set setModalParams($event) {
        if ($event)
            this._modalParams = $event
    }

    @Input('array')
    set setParams($event) {
        this.array = $event;
    }

    @Input('inputValue')
    set setInputValue($event) {
        this.inputValue.setValue($event);;
        this._lastValue = $event
    }

    @Input('selectObject')
    set setSelectObject($event) {
        this._selectObject = $event
    }

    @Input('property')
    set setProperty($event) {
        if ($event)
            this._property = $event
    }
    @Output('setValue') private _value = new EventEmitter;
    @ViewChild('autocomplete', { static: false }) autocomplete: ElementRef;
    constructor(private _matDialog: MatDialog, private _appService: AppService) { }

    public openSelectModal(isCall: boolean): void {
        if ((isCall && !this.isDisabled) || (!isCall && this.isDisabled)) {
            let checkProperty = this._appService.checkProperty(this._selectObject, this._property)
            let selectObject = checkProperty == null ? this._selectObject : checkProperty;
            let defaultModalName = this._modalName ? this._modalName : SelectByModal
            let dialog = this._matDialog.open(defaultModalName, {
                minWidth: '500px',
                maxHeight: '50vh',
                data: {
                    array: this.array, params: this._modalParams, inputValue: this.inputValue, selectObjectId: selectObject, property: this._property,
                    select: this._selectObject
                },
                autoFocus: false
            })
            dialog.afterClosed().subscribe((data) => {
                if (data) {
                    this._value.emit(data)
                } else {
                    if (!this.inputValue.value)
                        this._value.emit(null)
                }
            })
        }
    }
    public filter(event): void {
        this.filterArray = [];
        this.array.forEach((data) => {
            for (let key of this.modalParams.keys) {
                if ((data[key].toString()).toLowerCase().indexOf((event.query).toString().trim().toLowerCase()) > -1) {
                    this.filterArray.push(data);
                    break
                }
            }
        })
    }

    public onSelect(event): void {
        if (event) {
            this._isSelect = true
            this._value.emit(event);
            let property = this._inputProperty ? this._inputProperty : this._property
            this.inputValue.setValue(event[property]);
        }
    }

    public onBlur(): void {
        let isSelect: boolean = false;
        let checkedProperty: string;
        if (this.inputValue.value) {
            for (let data of this.array) {
                for (let property of this.modalParams.keys) {
                    if (data[property] || data[property] == 0) {
                        if ((data[property].toString()).toLowerCase() == ((this.inputValue.value).toString()).toLowerCase()) {
                            isSelect = true;
                            checkedProperty = property;
                            break
                        }
                    }
                }
            }
            // this.array.forEach((data) => {
            //     this.modalParams.keys.forEach((property) => {
            //         console.log(this.inputValue.value);
            //         console.log(data[property]);

            //         if ((data[property].toString()).toLowerCase() == ((this.inputValue.value).toString()).toLowerCase()) {
            //             isSelect = true;
            //             checkedProperty = property
            //         }
            //     })

            // })
        }

        if (!isSelect) {
            // this.inputValue.setValue(this._lastValue);
            // if (!this._lastValue)
            this._value.emit(null);
            this.inputValue.setValue(null);

        }
        else {
            if (!this._isSelect) {
                let property = this._inputProperty ? this._inputProperty : this._property
                let value = (this.array.filter((data) => {
                    return (data[checkedProperty].toString()).toLowerCase() == (this.inputValue.value).toString().toLowerCase()
                })[0]);
                this._value.emit(value);
                this.inputValue.setValue(value[property]);
            } else {
                this._isSelect = false
            }
        }

    }
    ngOnDestroy() { }

    get modalParams() {
        return this._modalParams
    }
    get disabled(): boolean {
        return this.isDisabled
    }
}