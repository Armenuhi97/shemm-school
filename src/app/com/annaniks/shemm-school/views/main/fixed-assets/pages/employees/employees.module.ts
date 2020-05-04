import { NgModule } from "@angular/core";
import { EmployeeView } from './employees.view';
import { EmployeeRoutingModule } from './employees.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { EmployeesService } from './employees.service';
import { DatePipe } from '@angular/common';
import { DaysTabelModal } from 'src/app/com/annaniks/shemm-school/modals';

@NgModule({
    declarations: [EmployeeView, DaysTabelModal],
    entryComponents: [DaysTabelModal],
    imports: [EmployeeRoutingModule, SharedModule],
    providers: [EmployeesService, DatePipe],
    exports: [EmployeeView]
})
export class EmployeesModule { }