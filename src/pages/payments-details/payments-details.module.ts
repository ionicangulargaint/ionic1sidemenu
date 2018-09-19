import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PymentsDetailsPage } from './payments-details';

@NgModule({
  declarations: [
    PymentsDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(PymentsDetailsPage)
  ],
  exports: [
    PymentsDetailsPage
  ]
})
export class PaymentsPageModule { }
