import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { ClassifierView } from './classifier.view';
let classifierRoutes:Routes=[{path:'',component:ClassifierView}]
@NgModule({
    imports:[RouterModule.forChild(classifierRoutes)],
    exports:[RouterModule]
})
export class ClassifierRoutingModule{

}