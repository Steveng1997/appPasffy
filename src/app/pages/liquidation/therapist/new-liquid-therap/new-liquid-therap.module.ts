import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewLiquidTherapPageRoutingModule } from './new-liquid-therap-routing.module';
import { NewLiquidTherapPage } from './new-liquid-therap.page';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NewLiquidTherapPageRoutingModule,
    NgxPaginationModule,
  ],
  
  declarations: [NewLiquidTherapPage]
})

export class NewLiquidTherapPageModule {}
