import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-commission-member',
    templateUrl: 'commission-member.component.html',
    styleUrls: ['commission-member.component.scss']
})
export class CommissionMemberComponent {
    public commisionGroup:FormGroup
    constructor(private _fb: FormBuilder) { }
    ngOnInit() { 
        this._validate()
    }
    private _validate() {
        this.commisionGroup=this._fb.group({
            commisionChairmanName:[null],
            commisionChairmanPosition:[null],
            commisionMemberName1:[null],
            commisionMemberPosition1:[null],
            commisionMemberName2:[null],
            commisionMemberPosition2:[null],
        })
     }
}