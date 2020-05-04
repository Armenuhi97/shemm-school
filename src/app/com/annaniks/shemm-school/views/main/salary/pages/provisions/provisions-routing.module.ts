import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProvisionsView } from './provisions.view';

const provisionsRoutes: Routes = [
    { path: '', component: ProvisionsView }
]

@NgModule({
    imports: [RouterModule.forChild(provisionsRoutes)],
    exports: [RouterModule]
})

export class ProvisionsRoutingModule { }