import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditTherapistPage } from './edit-therapist.page';

const routes: Routes = [
  {
    path: '',
    component: EditTherapistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class EditTherapistPageRoutingModule { }