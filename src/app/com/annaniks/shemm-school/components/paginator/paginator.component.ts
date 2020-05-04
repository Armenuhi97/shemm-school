import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-paginator',
    templateUrl: 'paginator.component.html',
    styleUrls: ['paginator.component.scss'],

})
export class PaginatorComponent implements OnInit, OnDestroy {
    private _itemsCount: number;
    private _pageLength: number = 1;
    private _currentPage: number = 1;
    @Output('getLastPage') private _lastPageNumber: EventEmitter<any> = new EventEmitter<object>();

    @Input('currentPage')
    set currentPage($event) {
        this._currentPage = $event;
        this._setPagesVisibleCount();
    }
    private _visiblePageCount: number = 3;
    private _visiblePages: number[] = [];
    @Input('count')
    set count($event) {
        this._itemsCount = $event;
        this._setPagesCount();
        this._setPagesVisibleCount();
    }
    @Input('pageLength')
    set pageLength($event) {
        this._pageLength = $event;
        this._setPagesCount();
        this._setPagesVisibleCount();
    }
    @Output('paginate') private _paginateEvent: EventEmitter<object> = new EventEmitter<object>();
    public pages: Array<number> = [];
    constructor() { }

    ngOnInit() { }

    private _setPagesCount(): void {
        this.pages = [];
        this._visiblePages = [];
        let pageCount: number = Math.floor(this._itemsCount / this._pageLength);
        if (this._itemsCount % this._pageLength > 0) {
            pageCount += 1;
        }
        for (let i = 0; i < pageCount; i++) {
            this.pages.push(i + 1);
            if (i < this._visiblePageCount) {
                this._visiblePages.push(i + 1)
            }
        }
        this._lastPageNumber.emit(this.pages[this.pages.length - 1])
    }

    private _setPagesVisibleCount(): void {
        if (this._currentPage + 2 <= this.pages[this.pages.length - 1] && this._currentPage - 2 > 0) {
            this._visiblePages = [];
            let lastPageNumber: number = this._currentPage + 2;
            for (let i = this._currentPage - 2; i <= lastPageNumber; i++) {
                this._visiblePages.push(i);
            }
        }
        if (this._currentPage == this.pages[this.pages.length - 1] && this._currentPage - 4 >= 0) {
            this._visiblePages = [];
            for (let i = this._currentPage - 4; i <= this._currentPage; i++) {
                this._visiblePages.push(i);
            }
        }
        if (this._currentPage == 1) {
            this._visiblePages = [];
            let length: number = this.pages.length;
            if (length >= 5) {
                length = 5;
            }
            else {
                length = this.pages.length;
            }
            for (let i = 1; i <= length; i++) {
                this._visiblePages.push(i);
            }
        }
        if (this._currentPage == this.pages[this.pages.length - 1]) {
            this._visiblePages = [];
            let length: number = this.pages.length;
            if (length - 5 > 0) {
                for (let i = length - 4; i <= length; i++) {
                    this._visiblePages.push(i);
                }
            }
            else {
                for (let i = 1; i <= length; i++) {
                    this._visiblePages.push(i);
                }
            }

        }
        
    }

    public onClickPervious(): string {
        if (this._currentPage > 1) {
            this._currentPage -= 1;
            this._onPageChange(this._currentPage, true);
            this._setPagesVisibleCount();
        }
        return './'
    }

    public onClickNext(): void {
        if (this._currentPage < this.pages.length) {
            this._currentPage += 1;
            this._onPageChange(this._currentPage, true);
            this._setPagesVisibleCount();
        }
    }

    public onClickPageNumber(index: number): void {
        if (index < this.pages.length) {
            // this._currentPage = index + 1;
            this._onPageChange(this._currentPage, false);
            this._setPagesVisibleCount();
        }
    }

    private _onPageChange(pageNumber: number, isArrow: boolean): void {
        this._paginateEvent.emit({ pageNumber: pageNumber, isArrow: isArrow });
    }

    get currentPage(): number {
        return this._currentPage;
    }

    get visiblePages(): Array<number> {
        return this._visiblePages;
    }

    ngOnDestroy() { }
}