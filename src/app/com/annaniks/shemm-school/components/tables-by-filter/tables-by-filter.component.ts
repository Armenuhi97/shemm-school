import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-tables-by-filter',
    templateUrl: 'tables-by-filter.component.html',
    styleUrls: ['tables-by-filter.component.scss']
})
export class TablesByFilterComponent {
    @Input('titles') public titles;
    public isShowAddButton: boolean = false
    @Input('isShowAdd')
    set setIsShowAdd($event) {
        this.isShowAddButton = $event
    }

    @Input('header') public header: string;
    // @Input('items') public items: Items[];
    @Input('path') private _path: string;
    @Output('add') private _openModal = new EventEmitter;

    // public header: string;
    constructor(private _activatedRoute: ActivatedRoute,
        private _location: Location,
        private _router: Router
        ){
        this.header=this._activatedRoute.snapshot.data.title
    }
    public add() {
        this._openModal.emit(true);
    }

    public sort(title, ind: number) {
        // for (let i = 0; i < this.titles.length; i++) {
        //     if (ind !== i) {
        //         this.titles[i].isSort = false;
        //         this.titles[i].min = false;
        //         this.titles[i].max = false;
        //         this.titles[i].arrow = ''
        //     }
        // }

        // if (title.isSort) {
        //     if (title.min) {
        //         title.min = false;
        //         title.max = true;
        //         title.arrow = 'arrow_drop_down'
        //     } else {
        //         if (title.max) {
        //             title.max = false;
        //             title.min = true;
        //             title.arrow = 'arrow_drop_up'
        //         }
        //     }
        // } else {
        //     title.isSort = true;
        //     title.min = false;
        //     title.max = true;
        //     title.arrow = 'arrow_drop_down'
        // }

    }
    ngOnInit(): void {          
    }
    public goBack(): void {
        this._location.back();
    }
    public goHome(): void {
        this._router.navigate(['/'])
    }
}