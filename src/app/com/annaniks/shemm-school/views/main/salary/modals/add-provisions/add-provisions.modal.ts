import { Component, OnInit } from '@angular/core';
import { TabItem } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-provisions',
  templateUrl: './add-provisions.modal.html',
  styleUrls: ['./add-provisions.modal.scss']
})
export class AddProvisionsModal implements OnInit {

  constructor(private _dialogRef: MatDialogRef<AddProvisionsModal>) {}

public title:string;
public error=''
ngOnInit() { }

  private _tabsItem: TabItem[] = [
    { title: 'Ընդհանուր', isValid: true, key: 'provisionGeneral' },
    { title: 'Կազմակերպություն', isValid: true, key: 'provisionOrganization' },
    { title: 'b2b.armsoft հարթակ', isValid: true, key: 'otherData' },
    { title: 'Գույներ և տառատեսակներ', isValid: true, key: 'provisionColorsAndFonts' },
    { title: 'Տպելու դրույթներ', isValid: true, key: 'provisionPrintingPolicy' },   // ProvisionPrintingPolicyComponent
    { title: 'Տպելու ձևանմուշներ', isValid: true, key: 'provisionPrintingTemplates' },  // ProvisionPrintingTemplatesComponent
    { title: 'Փաստաթղթերի համարներ', isValid: true, key: 'provisionDocumentNumbers' },  //  ProvisionDocumentNumbersComponent
    { title: 'Հաշիվներ', isValid: true, key: 'provisionAccounts' },  //  ProvisionAccountsComponent
    { title: 'Աշխատավարձ', isValid: true, key: 'provisionSalary' },  // ProvisionSalaryComponent
    { title: 'Հիմնական միջոցներ', isValid: true, key: 'otherData' },
    { title: 'Համակարգային', isValid: true, key: 'otherData' }
  ];
  public activeTab: string = "Ընդհանուր";

  get tabsItem(): TabItem[] {
    return this._tabsItem
  }

  public routingTab(tabItem: TabItem): void {
    this.activeTab = tabItem.title;
    console.log(this.activeTab);
    
  }

  public close(): void {
    this._dialogRef.close()
  }

}
