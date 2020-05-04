import { Routes, RouterModule } from '@angular/router';
import { DepreciationCalculationView } from './depreciation-calculation.view';

const routes: Routes = [
  { path: '', component: DepreciationCalculationView },
];

export const DepreciationCalculationRoutes = RouterModule.forChild(routes);
