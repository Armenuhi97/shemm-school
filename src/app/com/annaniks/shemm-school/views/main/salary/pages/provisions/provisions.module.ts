import { NgModule } from '@angular/core';

import { ProvisionsView } from './provisions.view';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { ProvisionsRoutingModule } from './provisions-routing.module';

@NgModule({
  imports: [ SharedModule, ProvisionsRoutingModule ],
  declarations: [ProvisionsView]
})

export class ProvisionsModule { }
