import { NgModule } from "@angular/core";
import { EmployeesSalararyView } from './employees-salary.view';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { EmployeesSalaryRoutingModule } from './employees-salary.routing.module';
import { ConfirmModal } from 'src/app/com/annaniks/shemm-school/modals';

@NgModule({
    declarations: [EmployeesSalararyView,ConfirmModal],
    imports: [SharedModule, EmployeesSalaryRoutingModule],
    entryComponents:[ConfirmModal]
})
export class EmployeesSalaryModule { }