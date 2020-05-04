import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { GuardService } from './guard.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private _guardService: GuardService
    ) { }

    canActivate(): Observable<boolean> | boolean | Promise<boolean> {
        return this._guardService.checkAccessToken()
    }

}