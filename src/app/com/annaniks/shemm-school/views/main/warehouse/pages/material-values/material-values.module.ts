import { NgModule } from "@angular/core";
import { MaterialValuesView } from './material-values.view';
import { MaterialValuesRoutingModule } from './material-values.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { AddMaterialValueModal } from '../../modals';
import { MaterialValuesService } from './material-values.service';
import { UnitOfMeasurementService } from '../../../main-accounting/pages/unit-of-measurement/unit-of-measurement.service';

@NgModule({
    declarations: [MaterialValuesView,AddMaterialValueModal],
    imports: [MaterialValuesRoutingModule, SharedModule],
    entryComponents:[AddMaterialValueModal ],
    providers: [MaterialValuesService, UnitOfMeasurementService]

})
export class MaterialValuesModule { }