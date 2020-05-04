import { Component, OnInit, OnDestroy } from '@angular/core';
import { IMenu } from '../../../models/global.models';

const MENU_ACTIONS = [
    { icon: 'account_balance', navText: 'Մուտքագրեք Ձեր կազմակերպության տվյալները', routerLink: '' },
    { icon: 'bookmarks', navText: 'Մուտքագրեք Ձեր հաշվարկային հաշիվները բանկում', routerLink: '' },
    { icon: 'cached', navText: 'Ավելացրեք նոր հաշիվներ հաշվային պլանում', routerLink: '' },
    { icon: 'get_app', navText: 'Մուտքագրեք հաշիվների սկզբնական մնացորդները', routerLink: '' },
    { icon: 'info', navText: 'Մուտքագրեք տեղեկություններ Ձեր գործընկերների մասին', routerLink: '' },
    { icon: 'output', navText: 'Մուտքագրեք տեղեկությունների սկզբնական մնացորդները', routerLink: '' },
    { icon: 'perm_identity', navText: 'Ավելացրեք Ձեր ծառայությունները', routerLink: '' },
    { icon: 'redeem', navText: 'Ավելացրեք Ձեր ապրանքները և նյութական արժեքները', routerLink: '' },
    { icon: 'info', navText: 'Աշխատավարձի հաշվարկի օգնական', routerLink: '' },
    { icon: 'edit', navText: 'Ապրանքների հրապարակման օգնական ', routerLink: '' },
    { icon: 'edit', navText: 'Դիտեք ուսումնական հոլովակները', routerLink: '' },
];

const MENU_ITEMS = [
    { icon: 'bookmarks', navText: 'Հաշվապահություն', routerLink: '/main-accounting' },
    { icon: 'bookmarks', navText: 'Պահեստ', routerLink: '/warehouse' },
    { icon: 'bookmarks', navText: 'Աշխատավարձ', routerLink: '/salary' },
    { icon: 'bookmarks', navText: 'Հիմնական միջոցներ', routerLink: '/fixed-assets' },
    { icon: 'bookmarks', navText: 'Բանկ', routerLink: '/bank' },
];

@Component({
    selector: 'home-view',
    templateUrl: 'home.view.html',
    styleUrls: ['home.view.scss']
})
export class HomeView implements OnInit, OnDestroy {
    public menuActions: IMenu[] = [];
    public menuItems: IMenu[] = [];

    constructor() {
        this.menuActions = MENU_ACTIONS;
        this.menuItems = MENU_ITEMS;
    }

    ngOnInit() {
    }

    ngOnDestroy() { }
}
