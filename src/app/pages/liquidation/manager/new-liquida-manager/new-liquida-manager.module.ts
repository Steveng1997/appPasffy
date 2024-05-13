import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewLiquidaManagerPageRoutingModule } from './new-liquida-manager-routing.module';
import { NewLiquidaManagerPage } from './new-liquida-manager.page';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewLiquidaManagerPageRoutingModule,
    NgxPaginationModule,
  ],
  declarations: [NewLiquidaManagerPage]
})
export class NewLiquidaManagerPageModule {}
