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
import { ReceiveCustomerCreditModalComponent } from './receive-customer-credit-modal/receive-customer-credit-modal.component';
import { ChangeStorePhotoModalComponent } from './change-store-photo-modal/change-store-photo-modal.component';
import {MatDialogModule} from '@angular/material/dialog';



@NgModule({
  declarations: [
    ModalsComponent,
    AddCustomerModalComponent,
    AddItemModalComponent,
    CreateInvoiceModalComponent,
    AddItemCategoryModalComponent,
    ReceivePaymentModalComponent,
    GivePaymentModalComponent,
    ReceiveCustomerCreditModalComponent,
    ChangeStorePhotoModalComponent

  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatDialogModule
  ],
  exports: [
    ModalsComponent
  ]
})
export class ModalsModule { }
