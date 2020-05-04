import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable()
export class ComponentDataService {
    private _clickSubject = new Subject<{ isSend: boolean }>();
    private _clickState = this._clickSubject.asObservable();
    private _isGetOperationSubject = new Subject<{ isGet: boolean }>();
    private _isGetOperationState = this._isGetOperationSubject.asObservable();
    private _dataSubject = new Subject<{ data: any, type: string, isValid: boolean, isDeletedArray?: any }>();
    private _dataState = this._dataSubject.asObservable();
    public onClick() {
        this._clickSubject.next({ isSend: true })
    }
    public offClick() {
        this._clickSubject.next({ isSend: false })
    }
    public onIsGetOperation() {
        this._isGetOperationSubject.next({ isGet: true })
    }
    public offIsGetOperation() {
        this._isGetOperationSubject.next({ isGet: false })
    }
    public sendData(message, type: string, isValid: boolean, isDeletedArray?) {
        this._dataSubject.next({ data: message, type: type, isValid: isValid, isDeletedArray: isDeletedArray })
    }
    public getState() {
        return this._clickState
    }
    public getIsGetOperationState() {
        return this._isGetOperationState
    }
    public getDataState() {
        return this._dataState
    }
}