import { Routes, RouterModule } from '@angular/router';
import { AbsentView } from './absent.view';

const routes: Routes = [
  { path: '', component: AbsentView },
];

export const AbsentRoutingModule = RouterModule.forChild(routes);
