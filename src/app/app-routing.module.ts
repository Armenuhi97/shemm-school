import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  { path: 'auth', loadChildren: () => import('./com/annaniks/shemm-school/views/auth/auth.module').then(m => m.AuthModule) },
  { path: '', loadChildren: () => import('./com/annaniks/shemm-school/views/main/main.module').then(m => m.MainModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
