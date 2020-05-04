import { Routes, RouterModule } from '@angular/router';
import { AddHmTypeModal } from './add-hm-type.modal';

const routes: Routes = [
  { path: '', component: AddHmTypeModal },
];

export const AddHmTypeRoutes = RouterModule.forChild(routes);

