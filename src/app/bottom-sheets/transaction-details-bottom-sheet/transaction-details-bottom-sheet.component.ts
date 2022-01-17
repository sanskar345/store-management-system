import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-transaction-details-bottom-sheet',
  templateUrl: './transaction-details-bottom-sheet.component.html',
  styleUrls: ['./transaction-details-bottom-sheet.component.css']
})
export class TransactionDetailsBottomSheetComponent implements OnInit {

  transaction: any;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<TransactionDetailsBottomSheetComponent>
  ) { }

  ngOnInit(): void {
    this.transaction = this.data.transaction;

  }

  dissmiss(){
    this.bottomSheetRef.dismiss('hi');
    event.preventDefault();
  }

}
