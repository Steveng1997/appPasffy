import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ManagerPageRoutingModule } from './manager-routing.module';
import { ManagerPage } from './manager.page';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagerPageRoutingModule,
    NgxPaginationModule,
  ],
  declarations: [ManagerPage]
})
export class ManagerPageModule {}
