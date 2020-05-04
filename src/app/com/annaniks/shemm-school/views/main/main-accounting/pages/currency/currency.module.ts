import { NgModule } from "@angular/core";
import { CurrencyView } from './currency.view';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { CurrencyRoutingModule } from './currency.routing.module';
import { AddCurrencyModal } from '../../modals';
import { CurrencyService } from './currency.service';

@NgModule({
    declarations: [CurrencyView, AddCurrencyModal],
    imports: [SharedModule, CurrencyRoutingModule ],
    entryComponents: [AddCurrencyModal],
    providers:[CurrencyService]
})
export class CurrencyModule {

}