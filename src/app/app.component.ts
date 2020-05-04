import { Component } from '@angular/core';
import { FileService } from './file.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'shemm-school';

  constructor(private fileService: FileService) {
    // this.fileService.getFiles().then(console.log);
  }
}
