import { Component, Output, EventEmitter, Input } from "@angular/core";

@Component({
    selector: 'app-table',
    templateUrl: 'table.component.html',
    styleUrls: ['table.component.scss']
})
export class TableComponent {
    public isLock: boolean = false
    private _typeOperation: boolean = false;
    public isActiveButtons:boolean=true
    @Output('add') private _add = new EventEmitter;
    @Output('delete') private _delete = new EventEmitter;
    @Output('setValue') private _setValue = new EventEmitter;

    @Input('isLock')
    set setIsLock($event) {
        this.isLock = $event
    }
    @Input('isActiveButtons')
    set setIsActiveButtons($event){
        this.isActiveButtons=$event
    }
    @Input('typeOperation')
    set getIsHasTypeOperation($evevnt) {
        this._typeOperation = $evevnt
    }
    @Input('isShowButton') public isShowButton: boolean
    constructor() { }
    public addRow() {
        this._add.emit(true)
    }
    public deleteAll() {
        this._delete.emit(true)
    }
    public save() {

    }
    public setValue() {
        this._setValue.emit(true)
    }
    get isHasOperationTypeFilter(): boolean {
        return this._typeOperation
    }
}