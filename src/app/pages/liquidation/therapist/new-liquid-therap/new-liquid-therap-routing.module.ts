import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewLiquidTherapPage } from './new-liquid-therap.page';

const routes: Routes = [
  {
    path: '',
    component: NewLiquidTherapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewLiquidTherapPageRoutingModule {}
