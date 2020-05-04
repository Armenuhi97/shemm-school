import { NgModule } from '@angular/core';

import { SystemAdditionView } from './system-addition.view';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { SystemAdditionRoutingModule } from './system-addition-routing.module';

@NgModule({
  imports: [ SharedModule, SystemAdditionRoutingModule ],
  declarations: [SystemAdditionView]
})
export class SystemAdditionModule { }
