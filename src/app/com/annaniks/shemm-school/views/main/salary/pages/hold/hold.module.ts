import { NgModule } from '@angular/core';
import { HoldView } from './hold.view';
import { HoldRoutingModule } from './hold-routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';

@NgModule({
  imports: [ SharedModule,  HoldRoutingModule],
  declarations: [HoldView]
})
export class HoldModule { }
