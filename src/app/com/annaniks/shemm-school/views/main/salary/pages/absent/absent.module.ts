import { NgModule } from '@angular/core';
import { AbsentView } from './absent.view';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { AbsentRoutingModule } from './absent-routing.module';

@NgModule({
  imports: [SharedModule, AbsentRoutingModule],
  declarations: [AbsentView]
})
export class AbsentModule { }
