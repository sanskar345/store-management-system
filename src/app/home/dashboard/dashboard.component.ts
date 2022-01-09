import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { faHome, faUser, faSquare, faEllipsisV, faFileInvoice, faMoneyBillWave, faMoneyBill, faHandHolding, faMoneyBillWaveAlt, faRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { TransactionDetailsBottomSheetComponent } from 'src/app/bottom-sheets/transaction-details-bottom-sheet/transaction-details-bottom-sheet.component';
import { ApiService } from 'src/app/core/services/api.service';
import { UiService } from 'src/app/core/services/ui.service';
import { AddCustomerDialogComponent } from 'src/app/dialogs/add-customer-dialog/add-customer-dialog.component';
import { AddItemCategoryDialogComponent } from 'src/app/dialogs/add-item-category-dialog/add-item-category-dialog.component';
import { AddItemDialogComponent } from 'src/app/dialogs/add-item-dialog/add-item-dialog.component';
import { CreateInvoiceDialogComponent } from 'src/app/dialogs/create-invoice-dialog/create-invoice-dialog.component';
import { DialogsService } from 'src/app/dialogs/dialogs.service';
import { GivePaymentDialogComponent } from 'src/app/dialogs/give-payment-dialog/give-payment-dialog.component';
import { ReceiveCustomerCreditDialogComponent } from 'src/app/dialogs/receive-customer-credit-dialog/receive-customer-credit-dialog.component';
import { ReceivePaymentDialogComponent } from 'src/app/dialogs/receive-payment-dialog/receive-payment-dialog.component';
import { ModalsModule } from 'src/app/modals/modals.module';
import { ModalsService } from 'src/app/modals/modals.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {



  faHome = faHome;
  faUser = faUser;
  faSquare = faSquare;
  faEllipsisV = faEllipsisV;
  faFileInvoice = faFileInvoice;
  faMoneyBillWave = faMoneyBillWave;
  faMoneyBill = faMoneyBill;
  faMoneyBillWaveAlt = faMoneyBillWaveAlt;
  faRupeeSign = faRupeeSign;

  number = [12, 3];

  totalCustomersWithCredit: number;
  totalTransactionToday: number;
  totalItemsOutOfStock: number;
  transactions = [];


  constructor(
    private uiService: UiService,
    private apiService: ApiService,
    private dialogsService: DialogsService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private bottomSheet: MatBottomSheet,
    private spinner: NgxSpinnerService
  ) {
    route.params.subscribe(val => {
      console.log('from route');
      // this.getItemCategories();
    });
   }

  ngOnInit(): void {
    this.getAllInfo();
  }

  getAllInfo(){
    this.getTodayTransactionStats();
    this.getCustomerStatForCredit();
    this.getItemsOutOfStock();
    this.getTransactions({page: 1, limit: 2});
  }


  getItemCategories(){
    this.apiService.getItemCategory()
      .subscribe((response: {[key: string]: any}) => {
        this.spinner.hide('mainSpinner');
        if(response){
          console.log('itemCategory', response.data);

          this.dialogsService.itemCategories = response.data;
        }
      }, (error) => {
        this.spinner.hide('mainSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close')
      });
  }

  addItem(){
    this.uiService.addItemSubject.next(true);
  }

  //open Add item dialog

  openAddItemDialog() {
    this.getItemCategories();
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(AddItemDialogComponent, {
      width: '40vw',
      data : {
        showModal1: true,
        showModal2: false
      }
    });

    // const dialogRef = this.dialog.open(AlertDialogComponent);

    dialog.afterClosed().subscribe(
        () => this.getAllInfo()
    );


  }

  // open add item category dialog

  openAddItemCategoryDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(AddItemCategoryDialogComponent, {
      width: '40vw',
      data : {
      }
    });
  }
  // open add customer dialog

  openAddCustomerDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(AddCustomerDialogComponent, {
      width: '40vw',
      data : {
      }
    });

    // const dialogRef = this.dialog.open(AlertDialogComponent);

    dialog.afterClosed().subscribe(
      () => this.getAllInfo()
    );


  }

  // open crete invoice dialog

  openCreateInvoiceDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(CreateInvoiceDialogComponent, {
      width: '100vw',
      data : {
        showModal1: true,
        showModal2: false
      }
    });

    // const dialogRef = this.dialog.open(AlertDialogComponent);

    dialog.afterClosed().subscribe(
      (d) => this.getAllInfo()
    );


  }

  // open receive payment dialog

  openReceivePaymentDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(ReceivePaymentDialogComponent, {
      width: '100vw',
      data : {
        showModal1: true,
        showModal2: false
      }
    });

    // const dialogRef = this.dialog.open(AlertDialogComponent);

    dialog.afterClosed().subscribe(
      () => this.getAllInfo()
    );


  }

  // open receive payment dialog

  openGivePaymentDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(GivePaymentDialogComponent, {
      width: '100vw',
      data : {
        showModal1: true,
        showModal2: false
      }
    });

    // const dialogRef = this.dialog.open(AlertDialogComponent);

    dialog.afterClosed().subscribe(
      () => this.getAllInfo()
    );


  }

  // open receive customer credit dialog

  openReceiveCustomerCreditDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(ReceiveCustomerCreditDialogComponent, {
      width: '100vw',
      data : {
        showModal1: true,
        showModal2: false
      }
    });

    // const dialogRef = this.dialog.open(AlertDialogComponent);

    dialog.afterClosed().subscribe(
      () => this.getAllInfo()
    );


  }

  getCustomerStatForCredit(){
    this.spinner.show('mainSpinner');
    this.apiService.getCustomerStatForCredit()
      .subscribe((response: any) => {
        this.spinner.hide('mainSpinner');
        this.totalCustomersWithCredit = response.data.stats[0].totalCustomers;
        console.log('.cre', this.totalCustomersWithCredit);
        this.ref.detectChanges();

      }, error => {
        this.spinner.hide('mainSpinner');
        console.log(error);
        this.uiService.openSnackBar(error.error.message, 'Close');
      });
  }

  getTodayTransactionStats(){
    this.spinner.show('mainSpinner');
    const today = ((new Date()).toISOString()).split('T')[0];
    this.apiService.getTodayTransactionStats({date: today})
      .subscribe((response: any) => {
        this.totalTransactionToday = response.data.stats[0].totalTransactions;
        console.log('today::', this.totalTransactionToday);
        this.ref.detectChanges();
        this.spinner.hide('mainSpinner');
      }, error => {
        this.spinner.hide('mainSpinner');
        console.log(error);
        this.uiService.openSnackBar(error.error.message, 'Close');
      });
  }

  getItemsOutOfStock(){
    this.spinner.show('mainSpinner');
    this.apiService.getItemsOutOfStock()
      .subscribe((response: any) => {
        this.spinner.hide('mainSpinner');
        this.totalItemsOutOfStock = response.data.stats[0].itemsOutOfStock;
        console.log('getItemsOutOfStock::', this.totalItemsOutOfStock);
        this.ref.detectChanges();
      }, error => {
        this.spinner.hide('mainSpinner');
        console.log(error);
        this.uiService.openSnackBar(error.error.message, 'Close');
      });
  }

  getTransactions(params: {}){
    this.spinner.show('mainSpinner');
    this.apiService.getTransactions(params)
      .subscribe((response: any) => {
        this.spinner.hide('mainSpinner');
        if(response){
          console.log('transactions',response);
          this.transactions = response.data;
          this.ref.detectChanges();
        }
      }, error => {
        console.log(error);
        this.spinner.hide('mainSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');
      })
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
