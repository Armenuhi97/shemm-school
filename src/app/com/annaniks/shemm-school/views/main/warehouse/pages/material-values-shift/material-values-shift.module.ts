import { NgModule } from "@angular/core";
import { MaterialValuesShiftView } from './material-values-shift.view';
import { MaterialValuesShiftRoutingModule } from './material-values-shift.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';

@NgModule({
    declarations: [MaterialValuesShiftView],
    imports: [MaterialValuesShiftRoutingModule, SharedModule]
})
export class MaterialValuewShiftModule { }