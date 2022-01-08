import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDetailsBottomSheetComponent } from './transaction-details-bottom-sheet/transaction-details-bottom-sheet.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatBadgeModule} from '@angular/material/badge';




@NgModule({
  declarations: [
    TransactionDetailsBottomSheetComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    MatBadgeModule
  ],
  exports: [
    TransactionDetailsBottomSheetComponent
  ]
})
export class BottomSheetsModule { }
