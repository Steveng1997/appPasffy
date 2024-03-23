import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HelpsPageRoutingModule } from './helps-routing.module';
import { HelpsPage } from './helps.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelpsPageRoutingModule
  ],
  declarations: [HelpsPage]
})
export class HelpsPageModule { }
