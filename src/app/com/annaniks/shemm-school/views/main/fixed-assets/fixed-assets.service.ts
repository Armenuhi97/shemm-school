import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs';

@Injectable()
export class FixedAssetsService {
    private _isAutorized: string = 'isAuthorized';

    constructor(private _httpClient: HttpClient, private _cookieService: CookieService) { }

    public getSubdivision(): Observable<any> {
        let params = new HttpParams();
        return this._httpClient.get<any>('subdivision', { params })
    }
}