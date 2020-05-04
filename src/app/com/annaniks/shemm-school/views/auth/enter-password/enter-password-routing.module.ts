import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnterPasswordComponent } from './enter-password.component';

const enterPasswordRouter: Routes = [
    {
        path: '', component: EnterPasswordComponent
       
    }
]

@NgModule({
    imports: [RouterModule.forChild(enterPasswordRouter)],
    exports: [RouterModule]
})

export class EnterPasswordRoutingModule { }