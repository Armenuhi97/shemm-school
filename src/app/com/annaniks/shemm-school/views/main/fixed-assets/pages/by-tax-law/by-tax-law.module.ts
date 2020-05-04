import { NgModule } from '@angular/core';
import { ByTaxLawView } from './by-tax-law.view';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { ByTaxLawRoutingModule } from './by-tax-law-routing.module';

@NgModule({
  imports: [SharedModule, ByTaxLawRoutingModule],
  declarations: [ByTaxLawView]
})

export class ByTaxLawModule { }
