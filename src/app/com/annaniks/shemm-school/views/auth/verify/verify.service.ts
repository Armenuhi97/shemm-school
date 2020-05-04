import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class VerifyService {

    constructor(private _httpClient: HttpClient
    ) { }

    public checkParams(data): Observable<any> {
        return this._httpClient.post<any>('users/check/reset/token', data);
    }

}