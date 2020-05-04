import { NgModule } from '@angular/core';
import { VerifyComponent } from './verify.component';
import { VerifyRoutingModule } from './verify-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { VerifyService } from './verify.service';

@NgModule({
    declarations: [VerifyComponent],
    imports: [VerifyRoutingModule, SharedModule],
    providers: [VerifyService]
})

export class VerifyModule { }