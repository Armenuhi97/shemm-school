import { Routes, RouterModule } from '@angular/router';
import { AssignPositionView } from './assign-position.view';
import { ModuleWithProviders } from '@angular/core';

const assignPositionRoutes: Routes = [
  { path: '', component: AssignPositionView },
];

export const AssignPositionRoutingModule: ModuleWithProviders<RouterModule> = RouterModule.forChild(assignPositionRoutes);
