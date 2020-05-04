import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'enter-operation-from-file-modal',
    templateUrl: 'enter-operation-from-file.modal.html',
    styleUrls: ['enter-operation-from-file.modal.scss']
})
export class EnterOperationFromFileModal{
    public title:string;
    private _file=[];
    public defaultFiles=[];
    constructor(private _dialogRef: MatDialogRef<EnterOperationFromFileModal>,
        @Inject(MAT_DIALOG_DATA) private _date: { label: string },
        @Inject('CALENDAR_CONFIG') public calendarConfig) { }
        
    ngOnInit() {
        this.title = this._date.label;
    }

    public close(event) {
        if (event)
            this._dialogRef.close()
    }  
    public changeFile(event): void {         
        if (event) {
            let files = event.target.files;
            if (files.length > 0) {
                this._file.push({ file: files[0], name: files[0].name });
                let reader = new FileReader();
                reader.onload = (e: any) => {
                    this.defaultFiles.push({img: e.target.result,name:files[0].name});
                }
                if (event.target.files[0])
                    reader.readAsDataURL(event.target.files[0]);
            }
            event.preventDefault();
        }       
    }
    public delete(i:number){
        this.defaultFiles.splice(i,1);
        this._file.splice(i,1);       
    }
}