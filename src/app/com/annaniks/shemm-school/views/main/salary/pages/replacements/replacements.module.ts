import { NgModule } from '@angular/core';
import { ReplacementsView } from './replacements.view';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { ReplacementsRoutingModule } from './replacements-routing.module';
// import { ReplacementsRoutingModule } from './replacements-routing.module';

@NgModule({
  imports: [ SharedModule, ReplacementsRoutingModule ],
  declarations: [ ReplacementsView ]
})

export class ReplacementsModule { }
