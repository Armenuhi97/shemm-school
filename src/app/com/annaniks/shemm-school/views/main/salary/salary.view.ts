import { Component } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { SettlementDateModal, InvestmentDataModal, SalaryDocumentJournalModal, PaymentListModal, ShortDataModal, ConfirmAdditionRetentionModal } from './modals';

@Component({
    selector: 'salary-view',
    templateUrl: 'salary.view.html',
    styleUrls: ['salary.view.scss']
})
export class SalaryView {
    public header: string;
    private _salaryItems = [
        {
            title: 'Փաստաթղթեր',
            isOpen: true,
            items: [
                { label: 'Հաստատել հավելում/պահումը', modalName: ConfirmAdditionRetentionModal, isExist: true },
                { label: 'Արձակուրդային հաշվարկ', path: 'calculation-vacation-time' },
                { label: 'Նպաստների հաշվարկ', path: 'calculation-benefits' },
                { label: 'Վճարումներ', isExist: true },
                { label: 'Վճարումներ հաշվարկային հաշվից', path: 'payment-from-current-account' },
                { label: 'Աշխատավարձի ձևակերպումներ', isExist: true },
                { label: 'Վերջնահաշվարկ', path: 'final-calculations' },
                { label: 'Ներդրումային տվյալներ', modalName: InvestmentDataModal, isExist: true }
            ]
        },
        {
            title: 'գործողություններ',
            isOpen: true,
            items: [
                { label: 'Հաշվարկի ամսաթիվ', modalName: SettlementDateModal, isSmallModal: true, isExist: true },
                { label: 'Նշանակել հաստիքը', path: 'assign-position' },
                { label: 'Աշխատաժամանակի հաշվարկի տեղեկագիր', isExist: true },
                { label: 'Աշխատակիցների աշխատավարձի հաշվարկ', path: 'calculate-employees-salary' },
                { label: 'Ավելացնել դասացուցակ', isExist: true },
                { label: 'Աշխատավարձերի ցանկ', path: 'salaries-list' }
            ]
        },
        {
            title: 'հաշվետվություններ',
            isOpen: true,
            items: [
                { label: 'Եկամտային հարկի հաշվարկ', isExist: true },
                { label: 'Աշխատողի և քաղ․ պայման․ մատուցողի գրանցման հայտ', isExist: true },
                { label: 'Ավելացնել նախահաշիվ', isExist: true },
                { label: 'Հաշվարկային թերթիկ', modalName: PaymentListModal, isSmallModal: true, isExist: true  },
                { label: 'Բացականեր', path: 'absent'},
                { label: 'Փոխարինումներ', path: 'replacements'},
                { label: 'Դրույթներ', path: 'provisions'}
            ]
        },
        {
            title: 'տեղեկատուներ',
            isOpen: true,
            items: [
                { label: 'Աշխատակիցներ', path: 'employees' },
                { label: 'Ստորաբաժանումներ', path: 'subdivision' },
                { label: 'Պաշտոններ', path: 'position' },
                { label: 'Մասնագիտություններ', path: 'profession' },
                { label: 'Աշխատավարձի տեսակ', path: 'addition' },
                { label: 'Պահումներ', path: 'hold' },
                { label: 'Համակարգային հավելում/պահումներ', path: 'system-addition' },
                { label: 'Աշխատանքային օրացույց', isExist: true },
                // sitePath: 'https://www.irtek.am/views/calendarw.aspx'
                { label: 'Ամփոփ տվյալներ', modalName: ShortDataModal, isSmallModal: true, isExist: true },
            ]
        },
        {
            title: 'մատյաններ',
            isOpen: true,
            items: [
                { label: 'Աշխատավարձերի փաստաթղթի մատյան', modalName: SalaryDocumentJournalModal , isExist: true},
                { label: 'Աշխատանք աշխատակիցների հետ', isExist: true },
                { label: 'Ավելացնել փոխարինումներ', isExist: true }
            ]
        }
    ]

    constructor(private _activatedRoute: ActivatedRoute, private _router: Router, private _title: Title,
        private _matDialog: MatDialog) {
        this.header = this._activatedRoute.data['_value'].title;
        this._title.setTitle(this.header)
    }

    ngOnInit() { }

    public openOrClose(salary) {
        salary.isOpen = !salary.isOpen
    }
    public openModal(item) {
        if (item && item.sitePath) {
            window.location.href = item.sitePath
            return
        }
        if (item && item.path) {
            this._router.navigate([`/salary/${item.path}`])
        } else {
            if (item && item.modalName) {
                let label: string = item.longTitle ? item.longTitle : item.label;
                let param1 = {
                    width: '80vw',
                    minHeight: '55vh',
                    maxHeight: '85vh',
                    data: { label: label, type: item.type },
                    autoFocus: false
                }
                let param2 = {
                    width: '700px',
                    minHeight: '320px',
                    data: { label: label, type: item.type },
                    autoFocus: false

                }
                let modalParamms = item.isSmallModal ? param2 : param1
                this._matDialog.open(item.modalName, modalParamms)
            }
        }
    }
    public setArrowStyle(salary) {
        let style = {}
        if (salary.isOpen) {
            style['transform'] = "rotate(180deg)"
        }
        return style
    }
    get salaryItems() {
        return this._salaryItems;
    }

    ngOnDestroy() { }
}