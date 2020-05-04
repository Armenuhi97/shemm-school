import { NgModule } from '@angular/core';
import { AuthView } from './auth.view';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
    declarations: [AuthView,],
    imports: [AuthRoutingModule],
    providers: []
})
export class AuthModule { }
