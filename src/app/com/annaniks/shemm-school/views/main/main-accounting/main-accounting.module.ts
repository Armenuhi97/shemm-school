import { NgModule } from '@angular/core';
import { MainAccountingComponent } from './main-accounting.component';
import { MainAccountingRoutingModule } from './main-accounting-routing';

import { ServicesReceivedModal, AccountInvoiceModal,
    RemnantsModal, CirculationModal, TAccountModal, PartnerTAccountModal, ChartOfAccountModal, ColleaguesModal, MemorableOrdersModal,
    AddAccountModal, CashRegisterLeaveOrder, CashEntryOrderModal, BalanceModal, TunoverModal, ReceiveServiceModal, CurrencyRatesModal,
    CashOutgoingOrderModal, CashWarrantModal, AddCashRegisterModal, AddPriceOfServiceModal  } from './modals';
import { TAccountComponent, BalanceCommonComponent, ReceiveServiceCommonComponent, ReceiveServiceNamesComponent  } from '../../../components';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialValuesService } from '../warehouse/pages/material-values/material-values.service';
import { DatePipe } from '@angular/common';

@NgModule({
    declarations: [
        MainAccountingComponent,
        ServicesReceivedModal,
        AccountInvoiceModal,
        RemnantsModal,
        CirculationModal,
        TAccountModal,
        PartnerTAccountModal,
        ChartOfAccountModal,
        ColleaguesModal,
        MemorableOrdersModal,
        TAccountComponent,
        AddAccountModal,
        CashRegisterLeaveOrder,
        CashEntryOrderModal,
        BalanceModal,
        TunoverModal,
        ReceiveServiceModal,
        BalanceCommonComponent,
        ReceiveServiceCommonComponent,
        ReceiveServiceNamesComponent,
        CurrencyRatesModal,
        CashOutgoingOrderModal,
        CashWarrantModal,
        AddCashRegisterModal,
        AddPriceOfServiceModal
        
    ],
    imports: [ MainAccountingRoutingModule, SharedModule ],
    entryComponents: [
        ServicesReceivedModal,
        AccountInvoiceModal,
	    RemnantsModal,
        CirculationModal,
        TAccountModal,
        PartnerTAccountModal,
        ChartOfAccountModal,
        ColleaguesModal,
        MemorableOrdersModal ,
        AddAccountModal,
        CashRegisterLeaveOrder,
        CashEntryOrderModal,
        BalanceModal,
        TunoverModal,
        ReceiveServiceModal,
        CurrencyRatesModal,
        CashOutgoingOrderModal,
        CashWarrantModal,
        AddCashRegisterModal,
        AddPriceOfServiceModal
    ],
    providers: [MaterialValuesService, DatePipe]
           
})
export class MainAccountingModule { }

 