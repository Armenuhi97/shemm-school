import { NgModule } from '@angular/core';
import { MainFixedAssetsRoutingModule } from './main-fixed-asserts-routing.module';
import { MainFixedAssetsComponent } from './main-fixed-assets.component';
import { SharedModule } from '../../../../../shared/shared.module';

@NgModule({
    imports: [MainFixedAssetsRoutingModule,  SharedModule],
    declarations: [MainFixedAssetsComponent],
    entryComponents: []
})

export class MainFixedAssetsModule {

}
