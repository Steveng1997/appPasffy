import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TherapistPageRoutingModule } from './therapist-routing.module';
import { TherapistPage } from './therapist.page';

// Pipe
import { NgxPaginationModule } from 'ngx-pagination';
import { TherapistPipe } from 'src/app/core/pipe/therapist.pipe';
import { ManagerPipe } from 'src/app/core/pipe/manager.pipe';
import { DateLiquidationPipe } from 'src/app/core/pipe/date-liquidation.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TherapistPageRoutingModule,
    NgxPaginationModule,
    TherapistPipe,
    ManagerPipe,
    DateLiquidationPipe,
  ],

  declarations: [
    TherapistPage
  ]
})

export class TherapistPageModule { }