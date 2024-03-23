import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/login/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'tabs/:id',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'menu/:id',
    loadChildren: () => import('./pages/menu/menu.module').then(m => m.MenuPageModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./pages/setting/setting.module').then(m => m.SettingPageModule)
  },
  {
    path: 'manager',
    loadChildren: () => import('./pages/liquidation/manager/manager.module').then(m => m.ManagerPageModule)
  },
  {
    path: 'new-manager/:id',
    loadChildren: () => import('./pages/setting/manager/new-manager/new-manager.module').then(m => m.NewManagerPageModule)
  },
  {
    path: 'edit-manager/:id',
    loadChildren: () => import('./pages/setting/manager/edit-manager/edit-manager.module').then(m => m.EditManagerPageModule)
  },
  {
    path: 'therapist',
    loadChildren: () => import('./pages/liquidation/therapist/therapist.module').then(m => m.TherapistPageModule)
  },
  {
    path: 'new-therapist/:id',
    loadChildren: () => import('./pages/setting/therapist/new-therapist/new-therapist.module').then(m => m.NewTherapistPageModule)
  },
  {
    path: 'edit-therapist/:id',
    loadChildren: () => import('./pages/setting/therapist/edit-therapist/edit-therapist.module').then(m => m.EditTherapistPageModule)
  },
  {
    path: 'helps',
    loadChildren: () => import('./pages/helps/helps.module').then(m => m.HelpsPageModule)
  },
  {
    path: 'closing',
    loadChildren: () => import('./pages/closing/closing.module').then(m => m.ClosingPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/login/register/register.module').then( m => m.RegisterPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
