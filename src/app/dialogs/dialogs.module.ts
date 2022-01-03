import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { AddItemDialogComponent } from './add-item-dialog/add-item-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { AddItemCategoryDialogComponent } from './add-item-category-dialog/add-item-category-dialog.component';
import { CreateInvoiceDialogComponent } from './create-invoice-dialog/create-invoice-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserModule } from '@angular/platform-browser';
import { ReceivePaymentDialogComponent } from './receive-payment-dialog/receive-payment-dialog.component';
import { GivePaymentDialogComponent } from './give-payment-dialog/give-payment-dialog.component';


@NgModule({
  declarations: [
    AlertDialogComponent,
    AddItemDialogComponent,
    AddItemCategoryDialogComponent,
    CreateInvoiceDialogComponent,
    ReceivePaymentDialogComponent,
    GivePaymentDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  exports: [
    AlertDialogComponent
  ]
})
export class DialogsModule { }
