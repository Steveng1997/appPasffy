import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TherapistPageRoutingModule } from './therapist-routing.module';
import { TherapistPage } from './therapist.page';

// Pipe
import { DateLiquidationPipe } from 'src/app/core/pipe/date-liquidation.pipe';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TherapistPageRoutingModule,
    NgxPaginationModule
  ],

  declarations: [
    TherapistPage,
    DateLiquidationPipe
  ]
})

export class TherapistPageModule { }