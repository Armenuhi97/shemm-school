import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Items } from '../../../models/global.models';
import { ActPuttingIntoOperationModal, AcquisitionOperationCalculatorsModal, CalculationOfWearModal } from './modals';
import { ReconstructionModal } from './modals/reconstruction/reconstruction.modal';

@Component({
    selector: 'fixed-assets',
    templateUrl: 'fixed-assets.view.html',
    styleUrls: ['fixed-assets.view.scss']
})
export class FixedAssetsView implements OnInit, OnDestroy {
    public header: string = '';

    private _fixedAssetsSections: Items[] = [

        { label: 'ՀՄ-ի ձեռքբերում և շահագործում', path:'acquisition-operation-of-fixed-assets' },
        { label: 'Շահագործման հանձնման ակտ', path: 'act-putting-into-operation' },
        { label: 'Մաշվածքի հաշվարկ',  path: 'depreciation-calculation' },
        { label: 'Շահագործման հանձնման ակտ', path: 'act-putting-into-operation' },
        { label: 'Մաշվածքի հաշվարկ', modalName: CalculationOfWearModal },
        { label: 'Վերակառուցում', path:'reconstruction', type: 1 },
        { label: 'Վերագնահատում', path:'revaluation', type: 0 },
        { label: 'Հիմնական միջոցներ', path: 'main-fixed-assets' },
        { label: 'Կառուցվածքային ստորաբաժանումներ', path: 'structural-subdivision' },
        { label: 'Աշխատակիցներ', path: 'employess' },
        { label: 'Ստորաբաժանումներ', path: 'units' },
        { label: 'ՀՄ խումբ շահութահարկի օրենքով', path: 'by-tax-law'},
        { label: 'ՀՄ հաշվեկշռային արժեքներ', path: 'hmx-value-balance' },
        { label: 'ՀՄ տեսակ', path: 'hm-type'},
    ]

    constructor(private _activatedRoute: ActivatedRoute, private _router: Router, private _title: Title) {
        this.header = this._activatedRoute.data['_value'].title;
        this._title.setTitle(this.header)
    }

    ngOnInit() { }

    get fixedAssetsSections(): Items[] {
        return this._fixedAssetsSections;
    }

    ngOnDestroy() { }

}
