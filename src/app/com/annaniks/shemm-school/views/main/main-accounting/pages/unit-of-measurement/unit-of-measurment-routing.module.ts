import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnitOfMeasurementComponent } from './unit-of-measurement.component';

const unitOfMesaurmentRouter: Routes = [
    {
        path: '',
        component: UnitOfMeasurementComponent
    }
];

@NgModule({
    imports: [ RouterModule.forChild(unitOfMesaurmentRouter) ],
    exports: [ RouterModule ]
})

export class UnitOfMesaurmentRoutingModule {}
