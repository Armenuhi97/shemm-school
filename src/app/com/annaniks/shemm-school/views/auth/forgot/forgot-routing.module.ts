import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotComponent } from './forgot.component';

const forgotRoutes: Routes = [
    {
        path: '',
        component: ForgotComponent,
    }
]

@NgModule({
    imports: [RouterModule.forChild(forgotRoutes)],
    exports: [RouterModule]
})

export class ForgotRoutingModule{

}