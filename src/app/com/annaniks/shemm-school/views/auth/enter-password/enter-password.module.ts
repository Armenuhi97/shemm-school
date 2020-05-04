import { NgModule } from '@angular/core';
import { EnterPasswordComponent } from './enter-password.component';
import { EnterPasswordRoutingModule } from './enter-password-routing.module';
import { EnterPasswordService } from './enter-password.service';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    declarations: [EnterPasswordComponent],
    imports: [EnterPasswordRoutingModule, SharedModule],
    providers: [EnterPasswordService]
})

export class EnterPasswordModule {}