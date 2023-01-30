import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateComponent } from './candidate.component';
import { DocViewerComponentComponent } from './doc-viewer-component/doc-viewer-component.component';

const routes: Routes = [
  {
    path: '',
    component: CandidateComponent
    },
    {
        path: 'doc-viewer',
        component: DocViewerComponentComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateRoutingModule { }
