import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewQueueComponent } from './review-queue.component';

const routes: Routes = [
  {
    path: '',
    component: ReviewQueueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewQueueRoutingModule { }
