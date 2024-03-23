import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewManagerPageRoutingModule } from './new-manager-routing.module';
import { NewManagerPage } from './new-manager.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NewManagerPageRoutingModule
  ],
  declarations: [NewManagerPage]
})

export class NewManagerPageModule { }