import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ForgotService } from './forgot.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  private _verify = 'test';
  public forgotForm: FormGroup;
  public forgot: boolean = true;
  constructor(private _router: Router,
    private _route: ActivatedRoute,
    private _fb: FormBuilder,
    private _forgotService: ForgotService
  ) { }

  private _formBuilder() {
    this.forgotForm = this._fb.group({
      email: new FormControl(null, [Validators.required]),
    })
  }

  ngOnInit() {
    this._formBuilder();
  }

  public resetPassword() {
    this.forgot = !this.forgot;
    const email = this.forgotForm.get('email').value;

    let sendingEmail = {
      email: email
    }
    this._forgotService.resetPassword(sendingEmail).subscribe(data => {
     
    })
  }
}
