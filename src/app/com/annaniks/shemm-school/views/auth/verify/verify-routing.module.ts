import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerifyComponent } from './verify.component';

const verifyRouter: Routes = [{
    path: '',
    component: VerifyComponent
}]

@NgModule({
    imports: [RouterModule.forChild(verifyRouter)],
    exports: [RouterModule]
})

export class VerifyRoutingModule {

}
