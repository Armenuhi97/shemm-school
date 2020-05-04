import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NgxMaskModule } from 'ngx-mask';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PrimeNgCalendarMaskModule } from "src/app/com/annaniks/shemm-school/directives/racoon/primeng/src/lib/prime-ng-calendar-mask/prime-ng-calendar-mask";

import { SalaryOperationComponent, ReplenishmentCommonComponent } from 'src/app/com/annaniks/shemm-school/components';


import {
    AddPartnerCommonComponent, PartnertherDataComponent, AdditionalAddressComponent, SettlementAccountComponent, AvarageSalaryComponent, ColorsAndFontsComponent,
    OrganizationComponent, ProvisionsCommonComponent, ProvisionPrintingPolicyComponent,
    ProvisionPrintingTemplatesComponent,
    ProvisionDocumentNumbersComponent,
    ProvisionAccountsComponent,
    ProvisionSalaryComponent,
    MainFundsComponent,
    SystemicComponent,
} from 'src/app/com/annaniks/shemm-school/components';

// import {MenuModule} from 'primeng/primeng';
import {
    TabsComponent, TableComponent, ModalHeaderComponent, TablesByFilterComponent, ItemsCardComponent,
    OperationComponent, InvoiceCommonComponent, ProviderComponent, NamesListComponent,
    BuyerComponent, ColumnsComponent, DateComponent, CardComponent,
    EmployeeAddressesComponent, EmployeeLegislativeComponent,
    EmployeeCommonComponent, EmployeeOtherDataComponent, EmployeeAdditiveRetentionComponent, PaginatorComponent,
    EmployeesPaymentType,
} from '../components';
import { InvoiceModal } from '../views/main/warehouse/modals';
import { AddUnitModal, EmployeesModal } from '../views/main/fixed-assets/modals';
import { NameCodeTableComponent } from './components/name-code-table/name-code-table.component';
import { ModalDropdownComponent } from './components';
import { PaginatorModule } from 'primeng/paginator';
import { RouterModule } from '@angular/router';
import { SelectByModal } from './modals';
import { AddPositionModal } from '../views/main/salary/modals';
import { AddPartnerModal, AddMeasurmentModal } from '../views/main/main-accounting/modals';
import { AddGroupModal } from '../views/main/main-accounting/modals/add-group/add-group.modal';
import { AddSubsectionModal } from '../modals/add-subsection/add-subsection.modal';
import { DateListModal, AddEmployeeAdditiveRetention, SelectDocumentTypeModal } from '../modals';
import { DigitOnlyDirective } from '../directives/digit-only.directive';
// import { DigitOnlyDirective } from '../directives';
// import { DigitOnlyDirective } from '';
import { AutoCompleteModule } from 'primeng/autocomplete';


@NgModule({
    declarations: [
        TabsComponent,
        SalaryOperationComponent,
        TableComponent,
        ModalHeaderComponent,
        ReplenishmentCommonComponent,
        TablesByFilterComponent,
        ItemsCardComponent,
        OperationComponent,
        InvoiceModal,
        InvoiceCommonComponent,
        ProviderComponent,
        NamesListComponent,
        BuyerComponent,
        ColumnsComponent,
        DateComponent,
        DateListModal,
        CardComponent,
        AddUnitModal,
        NameCodeTableComponent,
        EmployeesModal,
        EmployeeCommonComponent,
        EmployeesPaymentType,
        EmployeeLegislativeComponent,
        EmployeeAddressesComponent,
        EmployeeOtherDataComponent,
        EmployeeAdditiveRetentionComponent,
        AddEmployeeAdditiveRetention,
        ModalDropdownComponent,
        PaginatorComponent,
        SelectByModal,
        AddPositionModal,
        AddPartnerModal,
        PartnertherDataComponent, AddGroupModal, SettlementAccountComponent,
        AddPartnerCommonComponent, AdditionalAddressComponent,
        AddSubsectionModal,
        AddMeasurmentModal,
        SelectDocumentTypeModal,
        AvarageSalaryComponent,
        DigitOnlyDirective,
        ColorsAndFontsComponent,
        OrganizationComponent,
        ProvisionsCommonComponent,
        ProvisionPrintingPolicyComponent,
        ProvisionPrintingTemplatesComponent,
        ProvisionDocumentNumbersComponent,
        ProvisionAccountsComponent,
        ProvisionSalaryComponent,
        MainFundsComponent,
        SystemicComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        MatDialogModule,
        MatToolbarModule,
        MatTreeModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        PrimeNgCalendarMaskModule,
        DropdownModule,
        CalendarModule,
        FormsModule,
        CheckboxModule,
        ReactiveFormsModule,
        PaginatorModule,
        AutoCompleteModule,
        NgxMaskModule.forRoot(),

    ],
    entryComponents: [AddSubsectionModal, AddGroupModal, SelectByModal, AddPartnerModal, InvoiceModal, DateListModal, AddUnitModal, EmployeesModal, AddEmployeeAdditiveRetention,
        AddPositionModal, AddMeasurmentModal, SelectDocumentTypeModal],
    exports: [
        CommonModule,
        MatDialogModule,
        MatToolbarModule,
        MatTreeModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        PrimeNgCalendarMaskModule,
        DropdownModule,
        CalendarModule,
        FormsModule,
        ReactiveFormsModule,
        TabsComponent,
        TableComponent,
        CheckboxModule,
        ModalHeaderComponent,
        TablesByFilterComponent,
        ItemsCardComponent,
        CardComponent,
        OperationComponent,
        InvoiceModal,
        InvoiceCommonComponent,
        ProviderComponent,
        NamesListComponent,
        BuyerComponent,
        ColumnsComponent,
        DateComponent,
        DateListModal,
        AddUnitModal,
        NameCodeTableComponent,
        EmployeesModal,
        EmployeeCommonComponent,
        EmployeesPaymentType,
        EmployeeLegislativeComponent,
        EmployeeAddressesComponent,
        EmployeeOtherDataComponent,
        EmployeeAdditiveRetentionComponent,
        AddEmployeeAdditiveRetention,
        ModalDropdownComponent,
        PaginatorModule,
        PaginatorComponent,
        SelectByModal,
        NgxMaskModule,
        AddPositionModal,
        AddPartnerModal,
        PartnertherDataComponent, AddGroupModal, SettlementAccountComponent,
        AddPartnerCommonComponent, AdditionalAddressComponent,
        AddSubsectionModal,
        AddMeasurmentModal,
        SelectDocumentTypeModal,
        AvarageSalaryComponent,
        DigitOnlyDirective,
        AutoCompleteModule,
        ColorsAndFontsComponent,
        OrganizationComponent,
        ProvisionsCommonComponent,
        ProvisionPrintingPolicyComponent,
        ProvisionPrintingTemplatesComponent,
        ProvisionDocumentNumbersComponent,
        ProvisionAccountsComponent,
        ProvisionSalaryComponent,
        MainFundsComponent,
        SystemicComponent,
        SalaryOperationComponent,
        ReplenishmentCommonComponent


    ],

})
export class SharedModule { }
