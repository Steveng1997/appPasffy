import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingPage } from './setting.page';

const routes: Routes = [
  {
    path: '',
    component: SettingPage,
    pathMatch: 'full'
  },
  {
    path: 'edit-therapist/:id',
    loadChildren: () => import('./therapist/edit-therapist/edit-therapist.module').then(m => m.EditTherapistPageModule)
  },
  {
    path: 'edit-manager/:id',
    loadChildren: () => import('./manager/edit-manager/edit-manager.module').then(m => m.EditManagerPageModule)
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class SettingPageRoutingModule { }