import { NgModule } from "@angular/core";
import { SubsectionView } from './subsection.view';
import { SubsectionRoutingModule } from './subsection.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';

@NgModule({
    declarations: [SubsectionView],
    imports: [SubsectionRoutingModule, SharedModule]
})
export class SubsectionModule {

}