import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-common-table-header',
    templateUrl: 'common-table-header.component.html',
    styleUrls: ['common-table-header.component.scss']
})
export class CommonTableHeaderComponent {
    @Input('titles') public titles: string[]
}