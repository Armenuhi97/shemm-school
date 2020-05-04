import { Component, Input,  Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'app-modal-header',
    templateUrl: 'modal-header.component.html',
    styleUrls: ['modal-header.component.scss']
})
export class ModalHeaderComponent {
    @Input('title') public title: string;
    @Output('close') private _close = new EventEmitter
    constructor() { }

    close() {
        this._close.emit('true')
    }
}