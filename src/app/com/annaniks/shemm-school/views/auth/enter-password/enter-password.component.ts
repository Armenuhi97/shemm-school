import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { EnterPasswordService } from './enter-password.service';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-enter-password',
  templateUrl: './enter-password.component.html',
  styleUrls: ['./enter-password.component.scss']
})
export class EnterPasswordComponent implements OnInit {

  public verifyForm: FormGroup;
  
  constructor(private _fb: FormBuilder,
    private _enterPasswordService: EnterPasswordService,
    private _cookieService: CookieService
    ) { }

  ngOnInit() {
    this._formBuilder()
  }
  private _formBuilder() {
    this.verifyForm = this._fb.group({
      password: new FormControl(null, Validators.required),
      rePassword: new FormControl(null, Validators.required)

    })
  }

  public changePassword() {
    const token = this._cookieService.get('token');
    if(token){
      const sendingNewData = {
        password: this.verifyForm.get('password').value,
        token: token
      }
      this._enterPasswordService.newPassword(sendingNewData).subscribe((data)=>{
        console.log(data);
        //  TODO
      })
    }
  }

  static passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value;
    const rePassword: string = control.get('rePassword').value;
    if (password !== rePassword) {
      control.get('confirmPassword').setErrors({ NoPassswordMatch: true });
    }
  }


  
} 
