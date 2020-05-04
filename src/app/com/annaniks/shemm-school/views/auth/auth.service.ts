import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILoginModel } from '../../models/global.models';
import { CookieService } from 'ngx-cookie';


@Injectable()
export class AuthService {
    private _isAutorized: string = 'isAuthorized';
    constructor(private _httpClient: HttpClient, private _cookieService: CookieService) { }

    public login(data: ILoginModel): Observable<any> {
        let params = new HttpParams();
        params = params.set(this._isAutorized, 'false');
        return this._httpClient.post<any>('login', data, { params })
    }


}