import { Component } from "@angular/core";
import { Items } from '../../../models/global.models';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MaterialValuesTAccountModal, AvailabilityCertificateModal, MaterialValuesInventoryModal, MaterialValueGroupModal, WarehouseProvisionsModal } from './modals';

@Component({
    selector: 'warehouse-view',
    templateUrl: 'warehouse․view.html',
    styleUrls: ['warehouse․view.scss']
})
export class WarehouseView {
    public header: string;

    private _warehouseItems: Items[] = [
        { label: 'Հաշիվ-ապրանքագիր', path: 'invoice' },
        { label: 'Պահեստի մուտքի օրդեր', path: 'entry-orders' },
        // { label: 'Պահեստի մուտքի օրդեր', modalName: EnterVaultModal },
        { label: 'Պահեստի ելքի օրդեր', path: 'exit-orders' },
        // { label: 'Պահեստի ելքի օրդեր', modalName: OutVaultModal },
        { label: 'Ապրանքի նշանակություն', path: 'warehouse-significance' },
        { label: 'ՆԱ տեղաշարժ', longTitle: 'Նյութական արժեքների տեղաշարժ', path: 'materail-values-shift' },
        { label: 'ՆԱ գույքագրում', modalName: MaterialValuesInventoryModal, longTitle: 'Նյութական արժեքների գույքագրում' },
        { label: 'Տեղեկանք ՆԱ առկայության մասին', modalName: AvailabilityCertificateModal },
        { label: 'ՆԱ T-հաշիվ', modalName: MaterialValuesTAccountModal },
        { label: 'Նյութական արժեքներ', path: 'material-values' },
        { label: 'Պահեստներ', path: 'warehouses' },
        { label: 'Ենթաբաժիններ', path: 'subsection' },
        { label: 'Խումբ', modalName: MaterialValueGroupModal, path: 'material-value-group' },
        { label: 'Հաշվառման մեթոդ', path: 'billing-method' },
        { label: 'Տեսակներ', path: 'types' },
        { label: 'ԱՏԳԱԱ և ԱԴԳՏ դասակարգիչ', path: 'classifier' },
        // { label: 'Դրույթներ', modalName: WarehouseProvisionsModal, longTitle: 'Դրույթներ', isSmallModal: true },
        { label: 'Դրույթների', path: 'provision-accounts' }
    ];


    constructor(private _activatedRoute: ActivatedRoute, private _router: Router, private _title: Title) {
        this.header = this._activatedRoute.data['_value'].title;
        this._title.setTitle(this.header)
    }

    ngOnInit() { }

    get warehouseItems(): Items[] {
        return this._warehouseItems;
    }
}
