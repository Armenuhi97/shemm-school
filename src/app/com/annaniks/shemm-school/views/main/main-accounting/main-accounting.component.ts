import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Items } from '../../../models/global.models';
import {
  TAccountModal,
  PartnerTAccountModal,
  BalanceModal,
  TunoverModal,
  CurrencyRatesModal
} from './modals/index';

import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-main-accounting',
  templateUrl: './main-accounting.component.html',
  styleUrls: ['./main-accounting.component.scss']
})
export class MainAccountingComponent implements OnInit {

  public header: string;

  private _mainAccountigItems: Items[] = [
    { label: 'Ստացված ծառայություններ', path: 'receive-service' },
    { label: 'Դրամարկղ', path: 'cash-registers' },
    { label: 'Դրամարկղի մուտքի օրդեր', path: 'cash-entry-order' },
    { label: 'Դրամարկղի ելքի օրդեր', path: 'cash-exit-order' },
    { label: 'Հաշիվ ապրանքագիր', path: 'invoice' },
    { label: 'Մնացորդներ', modalName: BalanceModal },
    { label: 'Շրջանառություն', modalName: TunoverModal },
    { label: 'T-հաշիվ', modalName: TAccountModal },
    { label: 'Գործընկերոջ T-հաշիվ', modalName: PartnerTAccountModal },
    { label: 'Անալիտիկ խումբ 1', path: 'analytical-group-1' },
    { label: 'Անալիտիկ խումբ 2', path: 'analytical-group-2' },
    { label: 'Հաշվային պլան', path: 'chart-of-accounts' },
    { label: 'Գործընկերներ', path: 'partners' },
    { label: 'Ծառայություններ', path: 'services' },
    { label: 'Ծառայության գին', path: 'price-of-services' },
    { label: 'Չափման միավոր', path: 'unit-measurment' },
    { label: 'Արտայժույթներ', path: 'currency' },
    { label: 'Արտարժույթի փոխարժեքներ', modalName: CurrencyRatesModal },
    { label: 'Բանկեր', path: 'bank' },
    { label: 'Տիպային գործողություններ', path: 'typical-actions' },
    { label: 'Բանաձևեր', path: 'formula' }
  ]

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _matDialog: MatDialog,
    private _title: Title) {
    this.header = this._activatedRoute.data['_value'].title;
    this._title.setTitle(this.header);
  }

  ngOnInit() {
  }

  public openModal(item: Items): void {
    if (item.path) {
      this._router.navigate([`/main-accounting/${item.path}`])
    } else {
      if (item && item.modalName) {
        this._matDialog.open(item.modalName, {
          width: '80vw',
          minHeight: '90vh',
          maxHeight: '85vh',
          panelClass: 'fixed-assets-modal',
          autoFocus: false,
          data: { label: item.label, type: item.type }
        })
      }
    }
  }

  get mainAccountigItems(): Items[] {
    return this._mainAccountigItems
  }
}
