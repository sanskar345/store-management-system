import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCustomerModalComponent } from './add-customer-modal/add-customer-modal.component';
import { ModalsComponent } from './modals.component';
import { AddItemModalComponent } from './add-item-modal/add-item-modal.component';
import { CreateInvoiceModalComponent } from './create-invoice-modal/create-invoice-modal.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AddItemCategoryModalComponent } from './add-item-category-modal/add-item-category-modal.component';
import { ReceivePaymentModalComponent } from './receive-payment-modal/receive-payment-modal.component';
import { GivePaymentModalComponent } from './give-payment-modal/give-payment-modal.component';




@NgModule({
  declarations: [
    ModalsComponent,
    AddCustomerModalComponent,
    AddItemModalComponent,
    CreateInvoiceModalComponent,
    AddItemCategoryModalComponent,
    ReceivePaymentModalComponent,
    GivePaymentModalComponent

  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  exports: [
    ModalsComponent
  ]
})
export class ModalsModule { }
