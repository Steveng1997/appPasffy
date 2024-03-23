import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClosingPageRoutingModule } from './closing-routing.module';
import { ClosingPage } from './closing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClosingPageRoutingModule
  ],
  declarations: [ClosingPage]
})
export class ClosingPageModule {}
