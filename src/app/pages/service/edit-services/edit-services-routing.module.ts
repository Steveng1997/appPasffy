import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditServicesPage } from './edit-services.page';

const routes: Routes = [
  {
    path: '',
    component: EditServicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditServicesPageRoutingModule {}
