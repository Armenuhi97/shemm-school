import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { HomeView } from './home.view';
import { CommonModule } from '@angular/common';
import { MainNavbarComponent } from '../../../components/main-navbar/main-navbar.component';

@NgModule({
    declarations: [HomeView, MainNavbarComponent],
    imports: [HomeRoutingModule, CommonModule],
    providers: []
})
export class HomeModule { }
