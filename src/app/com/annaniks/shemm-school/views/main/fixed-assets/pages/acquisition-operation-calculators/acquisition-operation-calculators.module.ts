import { NgModule } from "@angular/core";
import { AcquisitionOperationOfFixedAssetsView } from './acquisition-operation-calculators.view';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { AcquisitionOperationOfFixedAssetsRoutingModule } from './acquisition-operation-calculators.routing.module';

@NgModule({
    declarations: [AcquisitionOperationOfFixedAssetsView],
    imports: [SharedModule, AcquisitionOperationOfFixedAssetsRoutingModule]
})
export class AcquisitionOperationOfFixedAssetsModule { }