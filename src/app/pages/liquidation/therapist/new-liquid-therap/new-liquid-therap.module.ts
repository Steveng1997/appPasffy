import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewLiquidTherapPageRoutingModule } from './new-liquid-therap-routing.module';
import { NewLiquidTherapPage } from './new-liquid-therap.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewLiquidTherapPageRoutingModule
  ],
  
  declarations: [NewLiquidTherapPage]
})

export class NewLiquidTherapPageModule {}
