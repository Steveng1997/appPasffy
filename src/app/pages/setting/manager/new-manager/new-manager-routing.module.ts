import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewManagerPage } from './new-manager.page';

const routes: Routes = [
  {
    path: '',
    component: NewManagerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class NewManagerPageRoutingModule { }