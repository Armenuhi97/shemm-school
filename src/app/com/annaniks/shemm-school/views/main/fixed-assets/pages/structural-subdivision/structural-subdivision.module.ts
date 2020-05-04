import { NgModule } from "@angular/core";
import { StructuralSubdivisionView } from './structural-subdivision.view';
import { StructuralSubdivisionRoutingModule } from './structural-subdivision.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { StructuralSubdivisionModal } from '../../modals';

@NgModule({
    declarations: [StructuralSubdivisionView, StructuralSubdivisionModal],
    imports: [StructuralSubdivisionRoutingModule, SharedModule],
    entryComponents: [StructuralSubdivisionModal]
})
export class StructuralSubdivisionModule { }