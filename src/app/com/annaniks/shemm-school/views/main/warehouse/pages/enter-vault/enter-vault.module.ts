import { NgModule } from "@angular/core";
import { EnterVaultView } from './enter-vault.view';
import { EnterValutRoutingModule } from './enter-vault.routing.mosule';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';

@NgModule({
    declarations: [EnterVaultView],
    imports: [EnterValutRoutingModule, SharedModule],
})
export class EnterValutModule { }