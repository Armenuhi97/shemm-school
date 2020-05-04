import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { FormulaView } from './formula.view';
let formulaRoutes: Routes = [{ path: '', component: FormulaView }]
@NgModule({
    imports: [RouterModule.forChild(formulaRoutes)],
    exports: [RouterModule]
})
export class FormulaRoutingModule { }