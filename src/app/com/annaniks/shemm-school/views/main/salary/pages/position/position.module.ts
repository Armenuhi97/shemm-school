import { NgModule } from "@angular/core";
import { PositionView } from './position.view';
import { PositionRoutingModule } from './position.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';

@NgModule({
    declarations: [PositionView],
    entryComponents: [],
    imports: [PositionRoutingModule, SharedModule]
})
export class PositionModule { }