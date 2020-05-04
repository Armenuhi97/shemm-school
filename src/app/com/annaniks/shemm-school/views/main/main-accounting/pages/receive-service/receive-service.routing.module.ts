import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { ReceiveServiceView } from './receive-service.view';
let receiveServiceRoutes: Routes = [{ path: '', component: ReceiveServiceView }]
@NgModule({
    imports: [RouterModule.forChild(receiveServiceRoutes)],
    exports: [RouterModule]
})
export class ReceiveServiceRoutingModule { }