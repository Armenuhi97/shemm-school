import { NgModule } from "@angular/core";
import { BankAccountView } from './bank-account.view';
import { BankAccountRoutingModule } from './bank-account.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { AddBankAccountModal } from '../../../main-accounting/modals';

@NgModule({
    declarations: [BankAccountView, AddBankAccountModal],
    entryComponents: [AddBankAccountModal],
    imports: [BankAccountRoutingModule, SharedModule]
})
export class BankAccountModule { }