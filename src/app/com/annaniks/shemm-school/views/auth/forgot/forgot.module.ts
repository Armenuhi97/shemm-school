import { NgModule } from '@angular/core';
import { ForgotComponent } from './forgot.component';
import { ForgotRoutingModule } from './forgot-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { ForgotService } from './forgot.service';

@NgModule({
    declarations: [ForgotComponent],
    imports: [ForgotRoutingModule, SharedModule],
    providers: [ForgotService]
})

export class ForgotModule {

}