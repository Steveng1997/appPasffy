import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ServicePageRoutingModule } from './service-routing.module';
import { ServicePage } from './service.page';

// Pipes
import { SearchPipe } from 'src/app/core/pipe/search.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ServicePageRoutingModule
  ],
  declarations: [ServicePage, SearchPipe]
})

export class ServicePageModule { }
