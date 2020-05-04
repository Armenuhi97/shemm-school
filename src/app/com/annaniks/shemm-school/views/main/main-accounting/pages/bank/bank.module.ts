import { NgModule } from "@angular/core";
import { BankView } from './bank.view';
import { BankRoutingModule } from './bank.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { AddBank } from '../../modals';

@NgModule({
    declarations: [BankView,AddBank],
    imports: [BankRoutingModule, SharedModule],
    entryComponents:[AddBank]
})
export class BankModule { }