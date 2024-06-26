import { IonicModule } from '@ionic/angular';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsPageRoutingModule } from '../tabs/tabs-routing.module';
import { TabsPage } from '../tabs/tabs.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
  ],
  declarations: [TabsPage],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})

export class TabsPageModule { }