import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthView } from './auth.view';

const authRoutes: Routes = [
    {
        path: '', component: AuthView, children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
            { path: 'forgot', loadChildren: () => import('./forgot/forgot.module').then(m => m.ForgotModule) },
            { path: 'verify', loadChildren: () => import('./verify/verify.module').then(m => m.VerifyModule) },
            { path: 'forgot/enter-password', loadChildren: () => import('./enter-password/enter-password.module').then(m => m.EnterPasswordModule) }

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(authRoutes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
