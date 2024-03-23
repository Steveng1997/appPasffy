import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditManagerPageRoutingModule } from './edit-manager-routing.module';
import { EditManagerPage } from './edit-manager.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditManagerPageRoutingModule
  ],
  declarations: [EditManagerPage]
})

export class EditManagerPageModule { }
