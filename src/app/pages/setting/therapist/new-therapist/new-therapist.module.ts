import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewTherapistPageRoutingModule } from './new-therapist-routing.module';
import { NewTherapistPage } from './new-therapist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NewTherapistPageRoutingModule
  ],
  declarations: [NewTherapistPage]
})

export class NewTherapistPageModule { }