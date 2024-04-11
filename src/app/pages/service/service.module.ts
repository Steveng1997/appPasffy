import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ServicePageRoutingModule } from './service-routing.module';
import { ServicePage } from './service.page';

// Pipes
import { SearchPipe } from 'src/app/core/pipe/search.pipe';
import { PaymentMethodPipe } from 'src/app/core/pipe/payment-method.pipe';
import { TherapistPipe } from 'src/app/core/pipe/therapist.pipe';
import { ManagerPipe } from 'src/app/core/pipe/manager.pipe';
import { DatePipe } from 'src/app/core/pipe/date.pipe';
import { HourDatePipe } from 'src/app/core/pipe/hour-date.pipe';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ServicePageRoutingModule,
    NgxPaginationModule
  ],
  declarations: [
    ServicePage,
    SearchPipe,
    TherapistPipe,
    ManagerPipe,
    DatePipe,
    HourDatePipe,
    PaymentMethodPipe
  ]
})

export class ServicePageModule { }
