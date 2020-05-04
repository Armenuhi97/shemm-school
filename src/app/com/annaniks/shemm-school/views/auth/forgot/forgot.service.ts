import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class ForgotService {

    constructor(private _httpClient: HttpClient
        ) { }

    public resetPassword(data): Observable<any> {
        return this._httpClient.post<any>('users/reset', data);
    }
    
}