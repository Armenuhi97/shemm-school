import { NgModule } from "@angular/core";
import { RevaluationView } from './revaluation.view';
import { RevaluationRoutingModule } from './revaluation.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';

@NgModule({
    declarations: [RevaluationView],
    imports: [RevaluationRoutingModule, SharedModule]
})
export class RevaluationModule { }