import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators'
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable()
export class GuardService {
    constructor(
        private _cookieService: CookieService,
        private _httpClient: HttpClient,
        private _router: Router
    ) {
    }

    public checkAccessToken(): Observable<boolean> {
        let accessToken = this._cookieService.get('accessToken') || '';
        return this._httpClient.get('token/check').pipe(
            map((data) => {
                return true
            })
        )
    }
}
