import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ManagerPageRoutingModule } from './manager-routing.module';
import { ManagerPage } from './manager.page';

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
    ManagerPageRoutingModule,
    NgxPaginationModule,
    TherapistPipe,
    ManagerPipe,
    DateLiquidationPipe,
  ],
  declarations: [ManagerPage]
})
export class ManagerPageModule { }
