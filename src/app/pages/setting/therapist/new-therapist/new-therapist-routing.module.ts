import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewTherapistPage } from './new-therapist.page';

const routes: Routes = [
  {
    path: '',
    component: NewTherapistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class NewTherapistPageRoutingModule { }