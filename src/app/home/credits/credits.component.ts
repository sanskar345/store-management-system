import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { faRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { MOBILE_REGEX, ONLY_LETTERS } from 'src/app/core/constants/regex.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { UiService } from 'src/app/core/services/ui.service';
import { ReceiveCustomerCreditDialogComponent } from 'src/app/dialogs/receive-customer-credit-dialog/receive-customer-credit-dialog.component';
import { SelectDialogComponent } from 'src/app/dialogs/select-dialog/select-dialog.component';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.css']
})
export class CreditsComponent implements OnInit {

  @ViewChild('input2', {static: true}) input2: ElementRef;
  @ViewChild('input3', {static: true}) input3: ElementRef;

  @ViewChild('paginator') paginator: MatPaginator;

  pageEvent: PageEvent;
  paginationLength: number = 100;
  searchInputForm: FormGroup;
  searchType = 'Customer_Mobile_Number';
  showClearSearchBtn = false;

  faRupeeSign = faRupeeSign;

  customers = [];
  customerSuggestion = [];
  invoiceDetail = {
    customer:  {
      address: null,
      adminIdFk: null,
      createdAt: null,
      credit:  null,
      dob: null,
      mobileNumber: null,
      name: null,
      _id: null,
      billsWithCredit: null
    }
  };
  search: string = "";
  pagination: any;

  constructor(
    private apiService: ApiService,
    private uiService: UiService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.builForms();
    this.getCustomers({'credit[gt]': 0,'page': 1, 'limit': 10});
    this.getCustomerStat();
    this.subscribeToInput2();
    this.subscribeToInput3();
  }

  builForms(){
    this.searchInputForm = this.formBuilder.group({
      Customer_Mobile_Number: ['', [Validators.pattern(MOBILE_REGEX)]],
      Customer_Name: ['', [Validators.pattern(ONLY_LETTERS), Validators.minLength(3)]],
    })
  }

  onSearch(event){
    if(this.search.length === 10){
      this.filterCustomers(this.search);
    }
  }

  filterCustomers(mobileNumber){
    this.customerSuggestion = this.customers.filter(c => c.mobileNumber === mobileNumber);
  }


  //get customers

  getCustomers(params: {}){
    this.spinner.show('mainSpinner');
    this.apiService.getCustomersWithQueryParams(params)
      .subscribe((response: any) => {
        this.spinner.hide('mainSpinner');
        this.customers = response.data;
        this.customerSuggestion = response.data;
      }, error => {
        this.spinner.hide('mainSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');

      });
  }

  getCustomersBySearch(params: {}){
    this.spinner.show('searchSpinner');
    this.apiService.getCustomersWithQueryParams(params)
      .subscribe((response: any) => {
        this.spinner.hide('searchSpinner');
        this.customers = response.data;
        this.customerSuggestion = response.data;
      }, error => {
        this.spinner.hide('searchSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');

      });
  }

  //go to modal

  onViewTransaction(customer){
    this.invoiceDetail.customer = customer;
    this.openReceiveCustomerCreditDialog(this.invoiceDetail);
  }

  // open receive customer credit dialog

  openReceiveCustomerCreditDialog(invoiceDetail: any) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(ReceiveCustomerCreditDialogComponent, {
      width: '100vw',
      data : {
        showModal1: true,
        showModal2: false,
        invoiceDetail
      }
    });

    // const dialogRef = this.dialog.open(AlertDialogComponent);

    dialog.afterClosed().subscribe(
        data => {}
    );


  }

  onPaginate(event): any{
    this.getCustomers({'credit[gt]': 0, 'page': event.pageIndex + 1, 'limit': event.pageSize});
  }

  getCustomerStat(){
    this.spinner.show('mainSpinner');
    this.apiService.getCustomerStatForCredit()
      .subscribe((response: any) => {
        this.spinner.hide('mainSpinner');
        this.paginationLength = response.data.stats[0].totalCustomers;

      }, error => {
        this.spinner.hide('mainSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');
      });
  }

  openSelectDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(SelectDialogComponent, {
      data : {
        title: 'Filter By',
        radioBtns: ['Customer_Name', 'Customer_Mobile_Number'],
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
    if(hasPreviousPage){
      this.paginator.firstPage();
    }else{
      this.getCustomers({'page': 1, 'limit': 10});
    }
  }

  subscribeToInput2(){
    // server-side search
    fromEvent(this.input2.nativeElement,'keyup')
        .pipe(
            filter(Boolean),
            debounceTime(1100),
            distinctUntilChanged(),
            tap((event:KeyboardEvent) => {
              if(this.input2.nativeElement.value.length > 0){
                this.showClearSearchBtn = true;
                if(this.searchInputFormControls.Customer_Mobile_Number.valid && this.searchType === 'Customer_Mobile_Number'){
                  this.getCustomersBySearch({'mobileNumber': this.input2.nativeElement.value});
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
              if(this.input3.nativeElement.value.length > 0){
                this.showClearSearchBtn = true;
                if(this.searchInputFormControls.Customer_Name.valid && this.searchType === 'Customer_Name'){
                  // this.filterCustomers(this.input.nativeElement.value);
                  this.getCustomersBySearch({'name': (this.input3.nativeElement.value).toLowerCase()});
                }
              }
            })
        )
        .subscribe();
  }

  get searchInputFormControls(){
    return this.searchInputForm.controls;
  }

}
