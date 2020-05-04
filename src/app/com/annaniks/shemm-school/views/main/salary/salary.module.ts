import { NgModule } from "@angular/core";
import { SalaryView } from './salary.view';
import { SalaryRoutingModule } from './salary.routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { SettlementDateModal, CalculationVacationTimeModal, CalculationBenefitsModal, FinalySettlementModal, PaymentFromCurrencyAccountModal, InvestmentDataModal, SalaryDocumentJournalModal, SelectDocumentModal, PaymentListModal, ShortDataModal, ConfirmAdditionRetentionModal, SelectAdditionRetentionModal, AddAbsencesComponent, AddHoldComponent, AddAssignPositionModal, MakeReplacementsModal, AddProvisionsModal, AddSystemAdditionModal } from './modals';
import { SelectEmployeeModal } from './modals/select-employees/select-employees.modal';
import { VacationTimeCommonComponent, BenefitsCommonComponent, FinalySettlementCommonComponent, CurrencyAccountCommonComponent, CurrencyAccountOperationComponent } from '../../../components';
import { AvarageSalaryDataComponent } from '../../../components/avarage-salary-data/avarage-salary-data.component';
import { SalaryService } from './salary.service';
import { DatePipe } from '@angular/common';

@NgModule({
    declarations: [
        SalaryView,
        SettlementDateModal,
        CalculationVacationTimeModal,
        SelectEmployeeModal,
        VacationTimeCommonComponent,
        CalculationBenefitsModal,
        BenefitsCommonComponent,
        FinalySettlementModal,
        FinalySettlementCommonComponent,
        PaymentFromCurrencyAccountModal,
        CurrencyAccountCommonComponent,
        CurrencyAccountOperationComponent,
        InvestmentDataModal,
        AvarageSalaryDataComponent,
        SalaryDocumentJournalModal,
        SelectDocumentModal,
        PaymentListModal,
        ShortDataModal,
        ConfirmAdditionRetentionModal,
        SelectAdditionRetentionModal,
        AddAbsencesComponent,
        AddHoldComponent,
        AddAssignPositionModal,
        MakeReplacementsModal,
        AddProvisionsModal,
        AddSystemAdditionModal
    ],
    entryComponents: [
        SettlementDateModal,
        CalculationVacationTimeModal,
        SelectEmployeeModal,
        CalculationBenefitsModal,
        FinalySettlementModal,
        PaymentFromCurrencyAccountModal,
        InvestmentDataModal,
        SalaryDocumentJournalModal,
        SelectDocumentModal,
        PaymentListModal,
        ShortDataModal,
        ConfirmAdditionRetentionModal,
        SelectAdditionRetentionModal,
        AddAbsencesComponent,
        AddHoldComponent,
        AddAssignPositionModal,
        MakeReplacementsModal,
        AddProvisionsModal,
        AddSystemAdditionModal
    ],
    imports: [SalaryRoutingModule, SharedModule],
    providers:[SalaryService,DatePipe]
})
export class SalaryModule { }