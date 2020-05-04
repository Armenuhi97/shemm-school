import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { ProvisionSalaryRoutingModule } from './provision-salary-routing.module';
import { ProvisionSalaryComponent } from './provision-salary.component';

@NgModule({
  imports: [ SharedModule, ProvisionSalaryRoutingModule ],
  declarations: [ProvisionSalaryComponent]
})

export class ProvisionSalaryModule { }
