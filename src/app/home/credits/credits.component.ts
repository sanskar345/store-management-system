import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { faRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { MOBILE_REGEX } from 'src/app/core/constants/regex.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { UiService } from 'src/app/core/services/ui.service';
import { ReceiveCustomerCreditDialogComponent } from 'src/app/dialogs/receive-customer-credit-dialog/receive-customer-credit-dialog.component';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.css']
})
export class CreditsComponent implements OnInit {

  @ViewChild('input', {static: true}) input: ElementRef;

  pageEvent: PageEvent;
  paginationLength: number = 100;

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

  searchInputForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private uiService: UiService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.builForms();
    this.getCustomers({'credit[gt]': 0});
    this.getCustomerStat();
  }

  builForms(){
    this.searchInputForm = this.formBuilder.group({
      mobileNumberSearch: ['', [Validators.pattern(MOBILE_REGEX)]]
    })
  }

  //search

  ngAfterViewInit() {
    // server-side search
    this.cdr.detectChanges();
    fromEvent(this.input.nativeElement,'keyup')
        .pipe(
            filter(Boolean),
            debounceTime(1100),
            distinctUntilChanged(),
            tap((event:KeyboardEvent) => {
              // console.log(event)
              console.log(this.input.nativeElement.value)
              if(this.input.nativeElement.value.length === 10){
                // this.filterCustomers(this.input.nativeElement.value);
                this.getCustomers({'credit[gt]': 0, 'mobileNumber': this.input.nativeElement.value});
              }
            })
        )
        .subscribe();
  }

  onSearch(event){
    console.log(this.search);
    if(this.search.length === 10){
      this.filterCustomers(this.search);
    }
  }

  filterCustomers(mobileNumber){
    this.customerSuggestion = this.customers.filter(c => c.mobileNumber === mobileNumber);
  }


  //get customers

  getCustomers(params: {}){
    this.apiService.getCustomersWithQueryParams(params)
      .subscribe((response: any) => {
        console.log('customers', response);
        this.customers = response.data;
        this.customerSuggestion = response.data;
      }, error => {
        this.uiService.openSnackBar(error.error.message, 'Close');
        console.log(error);

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
        data => console.log("Dialog output:", data)
    );


  }

  onPaginate(event): any{
    console.log(event);
    this.getCustomers({'credit[gt]': 0, 'page': event.pageIndex + 1, 'limit': event.pageSize});
  }

  getCustomerStat(){
    this.apiService.getCustomerStatForCredit()
      .subscribe((response: any) => {
        this.paginationLength = response.data[0].totalCustomers;

      }, error => {
        console.log(error);
        this.uiService.openSnackBar(error.error.message, 'Close');
      });
  }

}
