import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditRequirementComponent } from './add-edit-requirement/add-edit-requirement.component';
import { RequirementsComponent } from './requirements.component';
import { ViewDetailRequirementComponent } from './view-detail-requirement/view-detail-requirement.component';

const routes: Routes = [
    { path: '', component: RequirementsComponent},
    { path: 'addEditRequirement', component: AddEditRequirementComponent },
    { path: 'viewDetailRequirement', component: ViewDetailRequirementComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequirementsRoutingModule { }
