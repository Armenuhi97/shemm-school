import { NgModule } from "@angular/core";
import { ProfessionView } from './profession.view';
import { ProfessionRoutingModule } from './profession.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';

@NgModule({
    declarations: [ProfessionView],
    imports: [ProfessionRoutingModule, SharedModule]
})
export class ProfessionModule { }