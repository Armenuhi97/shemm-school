import { Injectable } from "@angular/core";
import { FormGroup, FormArray } from '@angular/forms';
import { MessageService } from 'primeng/api/public_api';
import { MainService } from '../views/main/main.service';

@Injectable()
export class AppService {
    
    /**
     * 
     * @param array 
     * @param element 
     * @param property 
     */
    public filterArray(array: Array<object>, element: string | number, property: string | number) {
        return array ? array.filter((el) => el[property] === element) : null
    }
    /**
     * 
     * @param variable 
     */
    public getBooleanVariable(variable: string | number | boolean): boolean {
        return (variable == 'TRUE') || (variable == 1) || (variable == true) ? true : false
    }
    /**
     * 
     * @param object 
     * @param property 
     * @param elseProperty 
     */
    public checkProperty(object: Object | Array<any>, property: string | number, elseProperty = null) {
        return (object && object[property]) ? object[property] : elseProperty
    }
    /**
     * 
     * @param array 
     * @param index 
     */
    public setDeletedFormArray(array, index: number) {
        let formArray = array as FormArray;
        let _deletedGroupsArray = [];
        if (formArray.controls[index]['controls']['id'] && formArray.controls[index]['controls']['id'].value) {
            _deletedGroupsArray.push({
                id: formArray.controls[index]['controls']['id'].value,
                isDeleted: true
            })
        }
        return _deletedGroupsArray
    }
    /**
     * 
     * @param count 
     * @param pageLength 
     * @param paginatorLastPageNumber 
     */
    public getPaginatorLastPage(count: number, pageLength: number, paginatorLastPageNumber: number): number {
        // let page = !paginatorLastPageNumber ? 1 : paginatorLastPageNumber;
        // let length = count + 1 - paginatorLastPageNumber * pageLength
        // if (length > 0) {
        //     page = paginatorLastPageNumber + 1
        // }
        // return page
        return 1
    }
    /**
     * 
     * @param array 
     * @param currentPage 
     */
    public setAfterDeletedPage(array, currentPage: number) {
        let page = (array && array.length) ? (array.length == 1 && currentPage !== 1) ? currentPage - 1 : currentPage : 1;
        return page
    }
    /**
     * 
     * @param formGroup 
     */
    public markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach(control => {
            if (control.controls) { // control is a FormGroup
                this.markFormGroupTouched(control);
            } else {
                // control is a FormControl
                control.markAsTouched();
            }
        });
    }
    /**
     * 
     * @param form 
     * @param controlName 
     * @param property 
     */
    public setInputValue(form: FormGroup, controlName: string, property: string) {
        return (form.get(controlName) && form.get(controlName).value && form.get(controlName).value[property]) ? form.get(controlName).value[property] : form.get(controlName).value
    }
    /**
     * 
     * @param form 
     * @param controlName 
     */
    public getFormControlvalue(form, controlName: string) {
        return form[controlName].value
    }
    /**
     * 
     * @param tabs 
     * @param count 
     */
    public checkIsValid(tabs, count?: number): boolean {
        let totalCount = 0
        for (let tab of tabs) {
            if (tab.isValid) {
                totalCount++
            }
        }
        return totalCount == tabs.length ? true : false
    }
    public setInvalidButton(tabs, form: FormGroup) {
        let keys = Object.keys(form.getRawValue())
        for (let key of keys) {
            tabs.forEach((tab) => {
                if (key == tab.key && form.get(key).invalid) {
                    tab.isValid = false
                }
            })
        }
        return tabs
    }
    public checkTabsValid(tabs, form) {
        tabs.forEach((data) => {
            if (form.get(data.key).invalid) {
                data.isValid = false
            }
        })
        return tabs
    }
    public setArrayWithDeleteParams(form, control, deletedElementsArray, isDeleteName?: boolean) {
        let newArray = []
        if (form.get(control).value && form.get(control).value.length) {
            form.get(control).value.forEach((element) => {
                if (!element.value.id) {
                    delete element.value.id;
                }
                if (isDeleteName)
                    delete element.value.name
                newArray.push(element.value)
            })
        }
        if (deletedElementsArray && deletedElementsArray.length) {
            deletedElementsArray.forEach(element => {
                newArray.push(element)
            });
        }
        return newArray
    }
    public documentKind: Array<{ text: string, id: number }> = [
        { text: 'Համաձայն N ․․․ պայմանագրի', id: 1 },
        { text: 'N ․․․ փաստաթղթի համաձայն', id: 2 }
    ]
    public getDocumentKind(): Array<{ text: string, id: number }> {
        return this.documentKind
    }
    public checkIsChangeProductArray(array1: Array<Object>, array2: Array<Object>): boolean {        
        if ((array1 && array1.length)) {
            if ((array2 && array2.length)) {
                if (array1.length == array2.length) {
                    for (let i = 0; i < array1.length; i++) {

                        if (JSON.stringify(array1[i]) !== JSON.stringify(array2[i])) return false
                    }
                    return true
                } else {

                    return false
                }
            } else {
                return false
            }
        } else {
            return true
        }
    }
    public getOperationObject(data) {
        let object = {
            debitId: this.checkProperty(data.debit, 'id'),
            dPartnersId: this.checkProperty(data.debitProcess, 'id'),
            dAnaliticGroup_2Id: this.checkProperty(data.debitGroup2, 'id'),
            dAnaliticGroup_1Id: this.checkProperty(data.debitGroup1, 'id'),
            creditId: this.checkProperty(data.credit, 'id'),
            isAah: false,
            cPartnersId: this.checkProperty(data.creditProcess, 'id'),
            cAnaliticGroup_2Id: this.checkProperty(data.creditGroup2, 'id'),
            cAnaliticGroup_1Id: this.checkProperty(data.creditGroup1, 'id'),
            money: data.amountInDram,
            comment: data.comment,
        }
        if (data.id) {
            object['id'] = data.id
        }
        return object
    }

    public getAvarageSalaryObject(datePipe, data) {
        let object = {
            date: datePipe.transform(new Date(data.date), 'yyyy-MM-dd'),
            money: data.amount,
            esteem: data.isConsider,
            comment: data.comment
        }
        if (data.monthPart || data.monthPart == 0) {
            object['partOf_12'] = data.monthPart
        }
        if (data.id) {
            object['id'] = data.id
        }
        return object
    }
    public setYearRange() {
        let today = new Date();
        return `2000:${today.getFullYear()}`
    }
    /**
     * 
     * @param item 
     * @param controlName 
     */
    public focus(item: FormGroup, controlName: string): void {
        if (item.get(controlName).value == 0)
            item.get(controlName).setValue(null)
    }
    /**
     * 
     * @param item 
     * @param controlName 
     */
    public blur(item: FormGroup, controlName: string): void {
        if (item.get(controlName).value == null || item.get(controlName).value == 0)
            item.get(controlName).setValue(0)
    }
    public roundSum(value) {
        return value ? value.toFixed(2) : value
    }

}
