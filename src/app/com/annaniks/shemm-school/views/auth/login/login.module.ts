import { NgModule } from '@angular/core';
import { LoginView } from './login.view';
import { LoginRoutingModule } from './login-routing.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    declarations: [LoginView],
    imports: [LoginRoutingModule, SharedModule],
    providers: []
})
export class LoginModule { }
