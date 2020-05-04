import { NgModule } from "@angular/core";
import { FixedAssetsView } from './fixed-assets.view';
import { FixedAssetsRoutingModule } from './fixed-assets-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { AdditionalTabComponent } from '../../../components/additional-tab/additional-tab.component';
import { AccountingTabComponent } from '../../../components/accounting-tab/accounting-tab.component';
import { GeneralTabComponent } from '../../../components/general-tab/general-tab.component';
import { AccountsTabComponent } from '../../../components/accounts-tab/accounts-tab.component';

import {
    ActPuttingIntoOperationModal,
    CalculationOfWearModal,
    ReconstructionModal,
    AcquisitionOperationCalculatorsModal,
    AddByTaxLawModal,
    AddHmxValueBalanceModal
} from './modals';
import {
    AdvertisingServicesComponent,
    WearAdvertisingservicesComponent,
    CommonComponent,
    RevaluationCommonComponent,
    CommonTableHeaderComponent,

} from '../../../components';
import { FixedAssetsService } from './fixed-assets.service';
import { DatePipe } from '@angular/common';
import { AddHmTypeModal } from './pages/add-hm-type/add-hm-type.modal';

@NgModule({
    declarations: [
        FixedAssetsView,
        AcquisitionOperationCalculatorsModal,
        AccountingTabComponent,
        GeneralTabComponent,
        AccountsTabComponent,
        AdditionalTabComponent,
        ActPuttingIntoOperationModal,
        AdvertisingServicesComponent,
        CalculationOfWearModal,
        WearAdvertisingservicesComponent,
        ReconstructionModal,
        CommonComponent,
        RevaluationCommonComponent,
        CommonTableHeaderComponent,
        AddByTaxLawModal,
        AddHmxValueBalanceModal,
        // AddHmTypeModal
    ],
    imports: [FixedAssetsRoutingModule, SharedModule],
    entryComponents: [
        AcquisitionOperationCalculatorsModal,
        AccountingTabComponent,
        ActPuttingIntoOperationModal,
        GeneralTabComponent,
        AccountsTabComponent,
        AdditionalTabComponent,
        CalculationOfWearModal,
        ReconstructionModal,
        AddByTaxLawModal,
        AddHmxValueBalanceModal,
        // AddHmTypeModal
    ],
    providers: [FixedAssetsService,DatePipe]
})
export class FixedAssetsModule {

}
