import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { faRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { TransactionDetailsBottomSheetComponent } from 'src/app/bottom-sheets/transaction-details-bottom-sheet/transaction-details-bottom-sheet.component';
import { MOBILE_REGEX, ONLY_LETTERS, ONLY_NUMBERS } from 'src/app/core/constants/regex.constant';
import { UNIQUE_NUMBER } from 'src/app/core/constants/storage.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UiService } from 'src/app/core/services/ui.service';
import { SelectDialogComponent } from 'src/app/dialogs/select-dialog/select-dialog.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  @ViewChild('input1', {static: true}) input1: ElementRef;
  @ViewChild('input2', {static: true}) input2: ElementRef;
  @ViewChild('input3', {static: true}) input3: ElementRef;

  @ViewChild('paginator') paginator: MatPaginator;


  pageEvent: PageEvent;
  paginationLength: number = 100;
  pageIndex = 0;
  pageSize = 10;

  faRupeeSign = faRupeeSign;

  transactions = [];
  noDataFoundMsg = 'Looks like does not have any Transactions.';
  searchInputForm: FormGroup;
  searchType = 'Bill_Number';
  showClearSearchBtn = false;

  constructor(
    private apiService: ApiService,
    private uiService: UiService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private storageService: StorageService,
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
    this.searchType = 'Bill_Number';
    this.builForms();
    this.getTransactions({'page': 1, 'limit': 10});
    this.getTransactionStat();
    this.subscribeToInput1();
    this.subscribeToInput2();
    this.subscribeToInput3();
  }


  getTransactions(params: {}){
    this.apiService.getTransactions(params)
      .subscribe((response: any) => {
        if(response){
          console.log('transactions',response);
          this.transactions = response.data;
        }
      }, error => {
        console.log(error);
        this.uiService.openSnackBar(error.error.message, 'Close');
      })
  }

  subscribeToInput1(){
    // server-side search
    fromEvent(this.input1.nativeElement,'keyup')
        .pipe(
            filter(Boolean),
            debounceTime(1100),
            distinctUntilChanged(),
            tap((event:KeyboardEvent) => {
              // console.log(event)
              console.log(this.input1.nativeElement.value)
              if(this.input1.nativeElement.value.length > 0){
                this.showClearSearchBtn = true;
                if(this.searchInputFormControls.Bill_Number.valid  && this.searchType === 'Bill_Number'){
                  this.getTransactions({'invoiceOrBillNumber': `${this.storageService.getAdminIdFk()}#N${this.input1.nativeElement.value}`});
                }
              }
            })
        )
        .subscribe();
  }

  subscribeToInput2(){
    // server-side search
    fromEvent(this.input2.nativeElement,'keyup')
        .pipe(
            filter(Boolean),
            debounceTime(1100),
            distinctUntilChanged(),
            tap((event:KeyboardEvent) => {
              // console.log(event)
              console.log(this.input2.nativeElement.value)
              if(this.input2.nativeElement.value.length > 0){
                this.showClearSearchBtn = true;
                if(this.searchInputFormControls.Customer_Mobile_Number.valid && this.searchType === 'Customer_Mobile_Number'){
                  this.getTransactions({'partyMobileNumber': this.input2.nativeElement.value});
                }
              }
            })
        )
        .subscribe();
  }

  subscribeToInput3(){
    // server-side search
    fromEvent(this.input3.nativeElement,'keyup')
        .pipe(
            filter(Boolean),
            debounceTime(1100),
            distinctUntilChanged(),
            tap((event:KeyboardEvent) => {
              // console.log(event)
              console.log(this.input3.nativeElement.value)
              if(this.input3.nativeElement.value.length > 0){
                this.showClearSearchBtn = true;
                if(this.searchInputFormControls.Customer_Name.valid && this.searchType === 'Customer_Name'){
                  // this.filterCustomers(this.input.nativeElement.value);
                  this.getTransactions({'partyName': (this.input3.nativeElement.value).toLowerCase()});
                }
              }
            })
        )
        .subscribe();
  }

  onPaginate(event): any{
    console.log(event);
    this.getTransactions({'page': event.pageIndex + 1, 'limit': event.pageSize});
  }

  getTransactionStat(){
    this.apiService.getTransactionStat()
      .subscribe((response: any) => {
        const transactionStats = response.data.stats[0];
        console.log('stats: ', transactionStats);
        if(transactionStats?.totalTransactions){
          this.paginationLength = transactionStats.totalTransactions;
        }
      }, error => {
        console.log(error);
        this.uiService.openSnackBar(error.error.message, 'Close');
      });
  }

  builForms(){
    this.searchInputForm = this.formBuilder.group({
      Customer_Mobile_Number: ['', [Validators.pattern(MOBILE_REGEX)]],
      Bill_Number: ['', [Validators.pattern(ONLY_NUMBERS), Validators.min(UNIQUE_NUMBER)]],
      Customer_Name: ['', [Validators.pattern(ONLY_LETTERS), Validators.minLength(3)]],
    })
  }

  get searchInputFormControls(){
    return this.searchInputForm.controls;
  }

  openSelectDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(SelectDialogComponent, {
      data : {
        title: 'Filter By',
        radioBtns: ['Customer_Name', 'Customer_Mobile_Number', 'Bill_Number'],
        showDangerBtn: true,
        showPrimaryBtn: true,
        dangerBtnName: 'Cancel',
        primaryBtnName: 'Done'
      }
    });

    // const dialogRef = this.dialog.open(AlertDialogComponent);

    dialog.afterClosed().subscribe(
        data => {
          if(data !== undefined && data !== null && data !== ''){
            this.searchType = data;
          }
        }
    );


  }

  onClickClearSearch(){
    this.showClearSearchBtn = false;
    this.searchInputForm.reset();
    const hasPreviousPage =  this.paginator.hasPreviousPage();
    console.log(hasPreviousPage);
    if(hasPreviousPage){
      this.paginator.firstPage();
    }else{
      this.getTransactions({'page': 1, 'limit': 10});
    }
  }

  openTransactionDetailBottomSheet(transaction){
    const bottomSheetRef = this.bottomSheet.open(TransactionDetailsBottomSheetComponent, {
      panelClass: 'transaction-details-bottom-sheet',
      data: {
        transaction
       },
    });

    bottomSheetRef.afterDismissed().subscribe(() => {
      console.log('Bottom sheet has been dismissed.:');
    });

  }


}
