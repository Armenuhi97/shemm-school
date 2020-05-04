import { NgModule } from '@angular/core';
import { DepreciationCalculationView } from './depreciation-calculation.view';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { DepreciationCalculationRoutes } from './depreciation-calculation.routing';
import { DatePipe } from '@angular/common';

@NgModule({
  imports: [SharedModule, DepreciationCalculationRoutes],
  declarations: [DepreciationCalculationView],
  providers: [DatePipe],
  entryComponents: []
})

export class DepreciationCalculationModule { }
