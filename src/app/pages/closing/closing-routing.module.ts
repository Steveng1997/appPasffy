import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClosingPage } from './closing.page';

const routes: Routes = [
  {
    path: '',
    component: ClosingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClosingPageRoutingModule {}
