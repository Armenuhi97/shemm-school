import { NgModule } from '@angular/core';
import { MainView } from './main.view';
import { MainRoutingModule } from './main-routing.module';
import { CommonModule } from '@angular/common';
import { MainService } from './main.service';
import { ComponentDataService } from '../../services';
import { OftenUsedParamsService } from '../../services/often-used-params';
import { ToastModule } from 'primeng/toast';
import {MessageService} from 'primeng/api';

@NgModule({
    declarations: [MainView],
    imports: [MainRoutingModule, CommonModule, ToastModule],
    providers: [MainService, ComponentDataService, OftenUsedParamsService, MessageService]
})
export class MainModule { }
