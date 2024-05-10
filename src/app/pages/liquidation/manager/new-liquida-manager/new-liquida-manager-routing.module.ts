import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewLiquidaManagerPage } from './new-liquida-manager.page';

const routes: Routes = [
  {
    path: '',
    component: NewLiquidaManagerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewLiquidaManagerPageRoutingModule {}
