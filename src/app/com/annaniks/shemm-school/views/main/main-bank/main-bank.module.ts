import { NgModule } from "@angular/core";
import { MainBankView } from './main-bank.view';
import { SharedModule } from '../../../shared/shared.module';
import { MainBankRoutingModule } from './main-bank.routing.module';
import { OperationImportedFromFile, EnterOperationFromFileModal, OperationImportedFromBankModal, AddOperationSignificanceModal } from './modals';
import { DatePipe } from '@angular/common';
import { MainBankService } from './main-bank-service';
import { DeptModal } from '../../../modals';


const COMPONENTS = [
  OperationImportedFromFile,
  EnterOperationFromFileModal,
  OperationImportedFromBankModal,
  AddOperationSignificanceModal,
  DeptModal
]

@NgModule({
  declarations: [MainBankView, COMPONENTS, MainBankView],
  imports: [SharedModule, MainBankRoutingModule],
  providers: [DatePipe, MainBankService],
  entryComponents: [COMPONENTS]

})

export class MainBankModule { }
