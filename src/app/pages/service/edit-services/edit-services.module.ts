import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditServicesPageRoutingModule } from './edit-services-routing.module';

import { EditServicesPage } from './edit-services.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditServicesPageRoutingModule
  ],
  declarations: [EditServicesPage]
})
export class EditServicesPageModule {}
