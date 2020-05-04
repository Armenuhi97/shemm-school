import { NgModule } from "@angular/core";
import { PartnersView } from './partners.view';
import { PartnersRoutingModule } from './partners.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { PartnerService } from './partners.service';
import { DatePipe } from '@angular/common';

@NgModule({
    declarations: [PartnersView],
    imports: [PartnersRoutingModule, SharedModule],
    entryComponents: [],
    providers: [PartnerService, DatePipe]
})
export class PartnersModule { } 