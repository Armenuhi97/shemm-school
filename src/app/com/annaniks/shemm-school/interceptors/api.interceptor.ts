import { environment } from '../../../../../environments/environment';

const API_URL = environment.API_URL;
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private _cookieService: CookieService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = (req.headers) ? req.headers : new HttpHeaders();
    let params = (req.params) ? req.params : new HttpParams()
    headers = headers.append('Content-Type', 'application/json');

    if ((!params.has('isAuthorized')) || (params.has('isAuthorized') && params.get('isAuthorized') != 'false')) {
      const accessToken: string = this._cookieService.get('accessToken');
      if (accessToken) {
        headers = headers.append('Authorization', 'Bearer ' + accessToken);
      }
    }

    if (params.has('isAuthorized')) {
      params = params.delete('isAuthorized');
    }

    const clonedRequest = req.clone({
      headers: headers,
      params: params,
      url: `${API_URL}${req.url}`
    });
    return next.handle(clonedRequest);
  }

} 