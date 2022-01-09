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
import { SharedModule } from '../shared/shared.module';
import { AddCustomerDialogComponent } from './add-customer-dialog/add-customer-dialog.component';
import { ChangePictureDialogComponent } from './change-picture-dialog/change-picture-dialog.component';
import { SelectDialogComponent } from './select-dialog/select-dialog.component';
import {MatRadioModule} from '@angular/material/radio';
import { UpdateItemDialogComponent } from './update-item-dialog/update-item-dialog.component';



@NgModule({
  declarations: [
    AlertDialogComponent,
    AddItemDialogComponent,
    AddItemCategoryDialogComponent,
    CreateInvoiceDialogComponent,
    ReceivePaymentDialogComponent,
    GivePaymentDialogComponent,
    ReceiveCustomerCreditDialogComponent,
    AddCustomerDialogComponent,
    ChangePictureDialogComponent,
    SelectDialogComponent,
    UpdateItemDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatDividerModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    SharedModule,
    MatRadioModule
  ],
  exports: [
    AlertDialogComponent
  ]
})
export class DialogsModule { }
