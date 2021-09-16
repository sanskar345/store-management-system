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



@NgModule({
  declarations: [
    ModalsComponent,
    AddCustomerModalComponent,
    AddItemModalComponent,
    CreateInvoiceModalComponent,

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
