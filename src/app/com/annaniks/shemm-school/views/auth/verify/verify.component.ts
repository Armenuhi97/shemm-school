import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VerifyService } from './verify.service';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  public getVerifyKey: string = '';
  public errMsg: boolean = false;
  public errText: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _verifyService: VerifyService,
    private _cookieService: CookieService,
  ) { }

  ngOnInit() {
    this._route.queryParams.subscribe(param => {
      this.getVerifyKey = param['verify'];
      if (param['verify']) {
        const sendingRefreshKey = {
          token: param['verify']
        }
        this._verifyService.checkParams(sendingRefreshKey).subscribe((data) => {
          this._cookieService.put('token', data.data.token);
          this.navigateEnterPassword()
        },
          (error) => {
            this.errText = true
          }
        )
      }
    })
  }

  private navigateEnterPassword() {
    this.errMsg = true
    setTimeout(()=>{
      this._router.navigate(['auth/forgot/enter-password']);
    }, 3000)
  }

  public navigateLogin() {
    this._router.navigate(['auth/login']);
  }
 
}
