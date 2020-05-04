import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { PriceOfServicesView } from './price-of-services.view';
import { PriceOfServicesRoutingModule } from './price-of-services-routing.module';
import { DatePipe } from '@angular/common';

@NgModule({
    declarations: [ PriceOfServicesView],
    imports: [PriceOfServicesRoutingModule, SharedModule],
    exports: [],
    providers: [DatePipe]
})

export class PriceOfServicesModule {  }