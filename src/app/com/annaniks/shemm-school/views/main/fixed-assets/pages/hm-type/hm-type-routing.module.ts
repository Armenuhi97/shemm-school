import { Routes, RouterModule } from '@angular/router';
import { HmTypeView } from './hm-type.view';

const routes: Routes = [
  { path: '', component: HmTypeView },
];

export const HmTypeRoutingModule = RouterModule.forChild(routes);
