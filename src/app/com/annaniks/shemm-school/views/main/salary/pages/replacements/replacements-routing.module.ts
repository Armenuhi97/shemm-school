import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ReplacementsView } from './replacements.view';

const replaceMentRoutes: Routes = [
  { path: '', component: ReplacementsView }
];

@NgModule({
  imports: [RouterModule.forChild(replaceMentRoutes)],
  exports: [RouterModule]
})

export class ReplacementsRoutingModule { }
