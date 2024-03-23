import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'vision',
        loadChildren: () => import('../vision/vision.module').then(m => m.VisionPageModule)
      },
      {
        path: 'menu',
        loadChildren: () => import('../menu/menu.module').then(m => m.MenuPageModule)
      },
      {
        path: 'setting',
        loadChildren: () => import('../setting/setting.module').then(m => m.SettingPageModule)
      },
      {
        path: 'helps',
        loadChildren: () => import('../helps/helps.module').then(m => m.HelpsPageModule)
      },
      {
        path: 'services',
        loadChildren: () => import('../service/service.module').then(m => m.ServicePageModule)
      },
      {
        path: 'new',
        loadChildren: () => import('../service/new/new.module').then(m => m.NewPageModule)
      },
      {
        path: 'closing',
        loadChildren: () => import('../closing/closing.module').then(m => m.ClosingPageModule)
      },
      {
        path: 'liquidation-manager',
        loadChildren: () => import('../liquidation/manager/manager.module').then(m => m.ManagerPageModule)
      },
      {
        path: 'new-manager',
        loadChildren: () => import('../setting/manager/new-manager/new-manager.module').then(m => m.NewManagerPageModule)
      },
      {
        path: 'edit-manager/:id',
        loadChildren: () => import('../setting/manager/edit-manager/edit-manager.module').then(m => m.EditManagerPageModule)
      },
      {
        path: 'liquidation-therapist',
        loadChildren: () => import('../liquidation/therapist/therapist.module').then(m => m.TherapistPageModule)
      },
      {
        path: 'new-therapist',
        loadChildren: () => import('../setting/therapist/new-therapist/new-therapist.module').then(m => m.NewTherapistPageModule)
      },
      {
        path: 'edit-therapist/:id',
        loadChildren: () => import('../setting/therapist/edit-therapist/edit-therapist.module').then(m => m.EditTherapistPageModule)
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
