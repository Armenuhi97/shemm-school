import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MainService } from '../../../views/main/main.service';
import { forkJoin, Subscription } from 'rxjs';
import { LoadingService } from '../../../services';
import { map } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { AddProvisionsModal } from '../../../views/main/salary/modals';

@Component({
  selector: 'app-colors-and-fonts',
  templateUrl: './colors-and-fonts.component.html',
  styleUrls: ['./colors-and-fonts.component.scss']
})
export class ColorsAndFontsComponent implements OnInit {
  @Input('title') public tabTitle: string;
  public colorsAndFontsFormGroup: FormGroup;
  private _subscription: Subscription
  public colorAndFont;
  public fontsType = [
    { name: 'Tahoma' },
    { name: 'Sans Serif' },
    { name: 'Open Sans' },
    { name: 'Roboto' }
  ];
  public fontSize = [
    { size: 10 },
    { size: 12 },
    { size: 14 },
    { size: 16 }
  ]

  constructor(
    private _dialogRef: MatDialogRef<AddProvisionsModal>,
    private _fb: FormBuilder,
    private _mainService: MainService,
    private _loadingService: LoadingService,
    @Inject('URL_NAMES') private _urls
  ) { }

  ngOnInit() {
    this._validate();
  }

  private _getProvisionColorsAndFontsUrl() {
    return this._mainService.getInformationByType(this._urls.provisionColorsAndFontsUrl).pipe(
      map((data) => {
        if (data.code == 200) {
          this.colorAndFont = data.data
        }
      })
    )
  }

  private _combineObservable() {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._getProvisionColorsAndFontsUrl()
    )
    this._subscription = combine.subscribe((data) => {
      this._loadingService.hideLoading()
    })
  }

  private _validate() {
    this.colorsAndFontsFormGroup = this._fb.group({
      fontOfSystem: this._fb.group({
        fontName: [null, Validators.required],
        size: [null, Validators.required]
      })
    })
    this._combineObservable()
  }

  public addColorsAndFonts() {
    this._loadingService.showLoading()
    let sendingData = {
      fontOfSystem: {
        fontName: this.colorsAndFontsFormGroup.get('fontOfSystem')['controls'].fontName.value['name'],
        size: this.colorsAndFontsFormGroup.get('fontOfSystem')['controls'].size.value['size']
      }
    }
    this._mainService.updateJsonByUrl(this._urls.provisionColorsAndFontsUrl, sendingData)
      .subscribe((data) => {
        if (data) {
          this._loadingService.hideLoading();
        }
      })

    console.log(88,this.colorsAndFontsFormGroup.get('fontOfSystem')
    );

  }

  public close() {
    this._dialogRef.close()
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }


}
