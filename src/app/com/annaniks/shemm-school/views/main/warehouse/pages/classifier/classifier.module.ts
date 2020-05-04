import { NgModule } from "@angular/core";
import { ClassifierView } from './classifier.view';
import { ClassifierRoutingModule } from './classifier.routing.module';
import { ClassifierModal } from '../../modals';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';

@NgModule({
    declarations: [ClassifierView, ClassifierModal],
    entryComponents: [ClassifierModal],
    imports: [ClassifierRoutingModule, SharedModule]
})
export class ClassifierModule { }