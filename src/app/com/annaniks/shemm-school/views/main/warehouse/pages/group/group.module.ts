import { NgModule } from '@angular/core';
import { GroupRoutingModule } from './group-routing.module';
import { GroupComponent } from './group.component';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';

@NgModule({
    declarations: [ GroupComponent],
    imports: [GroupRoutingModule, SharedModule]
})

export class GroupModule {

}