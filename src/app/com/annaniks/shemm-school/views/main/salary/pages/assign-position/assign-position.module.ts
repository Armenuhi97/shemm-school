import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { AssignPositionRoutingModule } from './assign-position-routing.module';
import { AssignPositionView } from './assign-position.view';

@NgModule({
  imports: [SharedModule, AssignPositionRoutingModule],
  declarations: [AssignPositionView]
})

export class AssignPositionModule { }
