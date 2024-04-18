import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VisionPageRoutingModule } from './vision-routing.module';
import { VisionPage } from './vision.page';

// Pipes}
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    VisionPageRoutingModule,
    NgxPaginationModule
  ],
  declarations: [VisionPage]
})

export class VisionPageModule { }