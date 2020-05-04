import { NgModule } from '@angular/core';
import { CashRegistersComponent } from './cash-registers.component';
import { CashRegistrationRoutingModule } from './cash-registers-routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';

@NgModule({
    declarations: [ CashRegistersComponent ],
    imports: [ SharedModule, CashRegistrationRoutingModule ],
    providers: []
})

export class CashRegistersModule { }