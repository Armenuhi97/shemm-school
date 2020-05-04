import { NgModule } from '@angular/core';
import { HmxValueBalanceView } from './hmx-value-balance.view';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { HmxValueBalanceRoutingModule } from './hmx-value-balance-routing.module';

@NgModule({
  imports: [ SharedModule, HmxValueBalanceRoutingModule ],
  declarations: [HmxValueBalanceView]
})
export class HmxValueBalanceModule { }





