import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

export interface ServerResponse {
    data: any;
    code: number;
    message: string
}

@Component({
    selector: 'login-view',
    templateUrl: 'login.view.html',
    styleUrls: ['login.view.scss']
})
export class LoginView implements OnInit, OnDestroy {

    private _loginForm: FormGroup;
    private _unsubscribe$: Subject<void> = new Subject<void>();

    constructor(
        private _fb: FormBuilder,
        private _authService: AuthService,
        private _cookieService: CookieService,
        private _router: Router
    ) { }

    ngOnInit() {
        this._formBuilder();
    }

    private _formBuilder(): void {
        this._loginForm = this._fb.group({
            email: ['vano.varderesyam@mail.ru', Validators.required],
            password: ['12345678', Validators.required]
        })
    }

    public login(): void {
        if (this._loginForm.valid) {
            let sendingData = {
                email: this._loginForm.get('email').value,
                password: this._loginForm.get('password').value
            }

            this._authService.login(sendingData)
                .pipe(takeUntil(this._unsubscribe$))
                .subscribe((data) => {
                    this._cookieService.put('accessToken', data.data.accessToken);
                    this._cookieService.put('refreshToken', data.data.refreshToken);
                    this._router.navigate(['/']);
                })
        }
    }

    get loginForm(): FormGroup {
        return this._loginForm;
    }


    ngOnDestroy() {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }
}

