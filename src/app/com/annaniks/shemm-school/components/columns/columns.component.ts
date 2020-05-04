import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-columns',
    templateUrl: 'columns.component.html',
    styleUrls: ['columns.component.scss']
})
export class ColumnsComponent {

    public keys = [];
    public activeItem;
    public activeKey: string;
    public activeShowItem;
    public availableItems=[]
    @Input('availableItems')
    set getItems($event){
        this.availableItems=$event
    }
    public displayItem = [];
    ngOnInit() {
        let keysArr = Object.keys(this.availableItems);
        keysArr.forEach((data) => {
            this.keys.push({ isOpen: false, key: data })
        })
    }


    public getRowStyle(item) {

        let style = {};
        if (item.isOpen) {
            style['transform'] = 'rotate(45deg)'
        } else {
            style['transform'] = 'rotate(360deg)'
        }
        return style
    }
    openItems(avaliable) {
        avaliable.isOpen = !avaliable.isOpen
    }
    public getSelectedItem(item, avaliable?) {
        this.activeItem = item;
        this.activeKey = avaliable && avaliable.key ? avaliable.key : '';
    }
    addItem() {
        if (this.availableItems && this.availableItems[this.activeKey]) {
            let index: number = this.availableItems[this.activeKey].indexOf(this.activeItem);
            this.availableItems[this.activeKey].splice(index, 1);
            let item = this.activeItem
            item['key'] = this.activeKey;
            this.displayItem.push(item);
        }

    }
    deleteItem() {
        let index: number = this.displayItem.indexOf(this.activeItem);
        this.displayItem.splice(index, 1);
        let obj = {
            id: this.activeItem.id,
            name: this.activeItem.name
        }        
        this.availableItems[this.activeItem.key].push(obj);        
        this.activeItem = null
        this.activeKey = ''
    }
    get disableAdd() {
        if (!this.activeItem || (this.activeItem && this.activeItem.key)) {
            return false
        } else {
            if (this.activeItem && !this.activeItem.key)
                return true
        }
    }
    get disableDelete() {
        if (!this.activeItem || (this.activeItem && !this.activeItem.key)) {
            return false
        } else {
            if (this.activeItem && this.activeItem.key) {
                return true
            }
        }
    }
}