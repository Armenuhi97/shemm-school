import { NgModule } from '@angular/core';
import { HmTypeView } from './hm-type.view';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { HmTypeRoutingModule } from './hm-type-routing.module';

@NgModule({
  imports: [ SharedModule, HmTypeRoutingModule ],
  declarations: [HmTypeView]
})
export class HmTypeModule { }



