import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { AddItemDialogComponent } from './add-item-dialog/add-item-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddItemCategoryDialogComponent } from './add-item-category-dialog/add-item-category-dialog.component';
import { CreateInvoiceDialogComponent } from './create-invoice-dialog/create-invoice-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserModule } from '@angular/platform-browser';
import { ReceivePaymentDialogComponent } from './receive-payment-dialog/receive-payment-dialog.component';
import { GivePaymentDialogComponent } from './give-payment-dialog/give-payment-dialog.component';
import { ReceiveCustomerCreditDialogComponent } from './receive-customer-credit-dialog/receive-customer-credit-dialog.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    AlertDialogComponent,
    AddItemDialogComponent,
    AddItemCategoryDialogComponent,
    CreateInvoiceDialogComponent,
    ReceivePaymentDialogComponent,
    GivePaymentDialogComponent,
    ReceiveCustomerCreditDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatDividerModule,
    MatCardModule,
    MatIconModule,
    FormsModule
  ],
  exports: [
    AlertDialogComponent
  ]
})
export class DialogsModule { }
