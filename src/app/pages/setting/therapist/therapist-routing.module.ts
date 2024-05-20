import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TherapistPage } from './therapist.page';

const routes: Routes = [
  {
    path: '',
    component: TherapistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TherapistPageRoutingModule {}
