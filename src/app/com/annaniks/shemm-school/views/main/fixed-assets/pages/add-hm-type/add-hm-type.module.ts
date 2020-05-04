import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { AddHmTypeModal } from './add-hm-type.modal';
import { AddHmTypeRoutes } from './add-hm-type-routing';

@NgModule({
  imports: [SharedModule, AddHmTypeRoutes],
  declarations: [ AddHmTypeModal ],
  entryComponents: [AddHmTypeModal]
})

export class AddHmTypeModule { }


