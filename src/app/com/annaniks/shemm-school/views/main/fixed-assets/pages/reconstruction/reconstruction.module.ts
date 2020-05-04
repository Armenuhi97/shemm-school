import { NgModule } from '@angular/core';
import { ReconstructionView } from './reconstruction.view';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { ReconstructionRoutingModule } from './reconstruction.routing.module';

@NgModule({
    declarations: [ReconstructionView],
    imports: [SharedModule, ReconstructionRoutingModule]
})
export class ReconstructionModule { }