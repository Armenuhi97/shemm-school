import { NgModule } from "@angular/core";
import { WarehouseView } from './warehouse․view';
import { WarehouseRoutingModule } from './warehouse․routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { EnterVaultModal, OutVaultModal, MaterialValuesShiftModal, MaterialValuesTAccountModal, AvailabilityCertificateModal, MaterialValuesInventoryModal, MaterialValueGroupModal, AddBillingMethodModal, AddWarehouseSignificanceModal, WarehouseProvisionsModal } from './modals';
import {

    EnterVaultCommonComponent,
    MaterialAssetsListComponent,
    EnterVaultAdditionallyComponent,
    OutVaultCommonComponent,
    OutVaultAdditionallyComponent,
    MaterialValueShiftCommonComponent,
    MaterialValueShiftAdditionallyComponent,
    AvailableCertificateComponent,
    MaterialValuesInventoryCommonComponent,
    CommissionMemberComponent
} from '../../../components';
import { ClassificationModal } from './modals/classification/classification.modal';
import { DatePipe } from '@angular/common';
import { WarehouseService } from './warehouse.service';
import { BatchModal } from '../../../modals';

@NgModule({
    declarations: [
        BatchModal,
        WarehouseView,
        AvailabilityCertificateModal,
        EnterVaultModal,
        EnterVaultCommonComponent,
        EnterVaultAdditionallyComponent,
        MaterialAssetsListComponent,
        OutVaultModal,
        OutVaultCommonComponent,
        OutVaultAdditionallyComponent,
        MaterialValuesShiftModal,
        MaterialValueShiftCommonComponent,
        MaterialValueShiftAdditionallyComponent,
        MaterialValuesTAccountModal,
        AvailableCertificateComponent,
        MaterialValuesInventoryModal,
        MaterialValuesInventoryCommonComponent,
        CommissionMemberComponent,
        ClassificationModal,
        MaterialValueGroupModal,
        AddBillingMethodModal,
        AddWarehouseSignificanceModal,
        WarehouseProvisionsModal
    ],
    imports: [WarehouseRoutingModule, SharedModule],
    entryComponents: [
        BatchModal,
        AvailabilityCertificateModal,
        EnterVaultModal,
        OutVaultModal,
        MaterialValuesShiftModal,
        MaterialValuesTAccountModal,
        MaterialValuesInventoryModal,
        ClassificationModal,
        MaterialValueGroupModal,
        AddBillingMethodModal,
        AddWarehouseSignificanceModal,
        WarehouseProvisionsModal


    ],
    providers: [DatePipe,WarehouseService]
})
export class WarehouseModule { }

