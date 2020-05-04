import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, of, BehaviorSubject, Subject } from 'rxjs';
import { catchError, map, finalize, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { ServerResponse } from '../models/global.models';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private _updateTokenEvent$: Subject<boolean> = new Subject<boolean>();
    private _updateTokenState: Observable<boolean>;
    private _loading: boolean = false;

    constructor(
        private _router: Router,
        private _cookieService: CookieService,
        private _httpClient: HttpClient
    ) {
        this._updateTokenState = this._updateTokenEvent$.asObservable();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


        return next.handle(req).pipe(
            catchError((err) => {
                const error = err.error;
                if (err.status === 401 || (error && error.code && error.code === 401)) {
                    if (!this._loading) {
                        this._updateRefreshToken();
                    }
                    return this._updateTokenState
                        .pipe(
                            switchMap((isUpdatedToken: boolean) => {
                                if (isUpdatedToken === true) {
                                    const accessToken: string = this._cookieService.get('accessToken');
                                    return next.handle(req.clone({
                                        headers: req.headers.append('Authorization', 'Bearer ' + accessToken)
                                    }));
                                }
                            })
                        )

                }
                return throwError(err);
            }))


    }

    private _updateRefreshToken(): void {
        this._loading = true;
        const refreshToken: string = this._cookieService.get('refreshToken');
        if (refreshToken) {
            let headers = new HttpHeaders();
            headers = headers.append('Authorization', 'Bearer ' + refreshToken);
            let params = new HttpParams();
            params = params.set('isAuthorized', 'false');

            this._httpClient.post<ServerResponse<{ accessToken: string }>>('refresh', {}, { headers, params })
                .pipe(finalize(() => this._loading = false))
                .subscribe(
                    (data) => {
                        const tokens = data.data;
                        this._cookieService.put('accessToken', tokens.accessToken);
                        this._updateTokenEvent$.next(true);
                    },
                    (error) => {
                        this._router.navigate(['/auth/login']);
                    })
        }
        else {
            this._router.navigate(['/auth/login']);
        }
    }
}
