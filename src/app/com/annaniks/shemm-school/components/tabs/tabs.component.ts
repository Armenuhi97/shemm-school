import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.component.html',
    styleUrls: ['tabs.component.scss']
})
export class TabsComponent {
    private _tabsItem=[]
    @Input('tabsItem')
    set setTabsItem($event) {                
        this._tabsItem = $event;
        this._activeTab=this._tabsItem[0];
        this._tabName.emit(this._activeTab)
    }
    @Output('getActiveTab') private _tabName = new EventEmitter;
    private _activeTab: string;
    constructor() { }

    public setActiveTab(name: string): void {
        this._activeTab = name;
        this._tabName.emit(this._activeTab)
    }

    get activeTab(): string {
        return this._activeTab
    }
    get tabsItem(): string[] {
        return this._tabsItem
    }
}