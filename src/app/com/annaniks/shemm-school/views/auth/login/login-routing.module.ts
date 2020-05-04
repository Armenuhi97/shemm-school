import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginView } from './login.view';

const loginRoutes: Routes = [
    { path: '', component: LoginView }
];

@NgModule({
    imports: [RouterModule.forChild(loginRoutes)],
    exports: [RouterModule]
})
export class LoginRoutingModule { }
