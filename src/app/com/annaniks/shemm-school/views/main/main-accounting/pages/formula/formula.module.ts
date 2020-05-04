import { NgModule } from "@angular/core";
import { FormulaView } from './formula.view';
import { FormulaRoutingModule } from './formula.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { AddFormulaModal} from '../../modals';

@NgModule({
    declarations: [FormulaView,AddFormulaModal],
    imports: [FormulaRoutingModule, SharedModule],
    entryComponents:[AddFormulaModal]
})
export class FormulaModule { }