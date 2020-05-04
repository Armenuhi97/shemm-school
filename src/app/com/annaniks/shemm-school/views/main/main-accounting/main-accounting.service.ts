import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { MainService } from '../main.service';

@Injectable()
export class MainAccountingService {

    private _isAutorized: string = 'isAuthorized';

    constructor(private _httpClient: HttpClient) {
    }

}