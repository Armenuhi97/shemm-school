import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { calendarConfig } from './com/annaniks/shemm-school/params/calendar-params';
import { CookieModule, CookieService } from 'ngx-cookie';

import { AppService, AuthGuard, GuardService } from './com/annaniks/shemm-school/services';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './com/annaniks/shemm-school/interceptors/api.interceptor';
import { environment } from 'src/environments/environment';
import { JwtInterceptor } from './com/annaniks/shemm-school/interceptors/jwt.interceptor';
import { AuthService } from './com/annaniks/shemm-school/views/auth/auth.service';
import { LoadingService } from './com/annaniks/shemm-school/services/loading.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingComponent } from './com/annaniks/shemm-school/components';
import { urlNames } from './com/annaniks/shemm-school/params/url.params';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { PrimeNgCalendarMaskModule } from "src/app/com/annaniks/shemm-school/directives/racoon/primeng/src/lib/prime-ng-calendar-mask/prime-ng-calendar-mask";
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CookieModule.forRoot(),
    MatProgressBarModule,
    ProgressSpinnerModule,
    PrimeNgCalendarMaskModule
  ],
  providers: [{ provide: 'CALENDAR_CONFIG', useValue: calendarConfig },
  { provide: 'URL_NAMES', useValue: urlNames },
    AuthService,
    LoadingService,

  {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  },
    CookieService,
    AppService,
  {
    provide: 'BASE_URL',
    useValue: environment.API_URL
  },
  { provide: MatDialogRef, useValue: {} },
  { provide: MAT_DIALOG_DATA, useValue: {} },
    AuthGuard, GuardService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
