import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { UnitOfMeasurementComponent } from './unit-of-measurement.component';
import { UnitOfMesaurmentRoutingModule } from './unit-of-measurment-routing.module';
import { TablesByFilterComponent } from 'src/app/com/annaniks/shemm-school/components';
import { UnitOfMeasurementService } from './unit-of-measurement.service';

@NgModule({
    declarations: [UnitOfMeasurementComponent],
    imports: [ UnitOfMesaurmentRoutingModule, SharedModule],
    exports: [],
    providers: [UnitOfMeasurementService]
})

export class UnitOfMeasurmentModule { }
