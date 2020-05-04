import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()

export class EnterPasswordService {
    constructor(private _httpClient: HttpClient
        ) { }

    public newPassword(data): Observable<any> {
        return this._httpClient.post<any>('users/reset/password', data);
    }
}