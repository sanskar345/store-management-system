import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faDotCircle, faEllipsisV, faFilter, faPlus, faRupeeSign, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/dialogs/alert-dialog/alert-dialog.component';
import { ApiService } from 'src/app/core/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UiService } from 'src/app/core/services/ui.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { AddCustomerDialogComponent } from 'src/app/dialogs/add-customer-dialog/add-customer-dialog.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  @ViewChild('input1', {static: true}) input1: ElementRef;

  pageEvent: PageEvent;
  paginationLength: number = 100;

  //icons

  faPlus = faPlus
  faDotCircle = faDotCircle
  faRupeeSign = faRupeeSign
  faEllipsisV = faEllipsisV
  faTrashAlt = faTrashAlt
  faFilter = faFilter

  //end of icons

  showSearchInput = false;

  customers = [];
  customersBySearch = [];

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

  searchByName = false;
  firstTime = true;
  windowWidth: number;

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private uiService: UiService
  ) { }

  ngOnInit(): void {
    this.windowWidth = window.screen.width;
    this.onStart();
    this.subscribeToInput1();
  }

  onStart(){
    this.getCustomers({page: 1, limit: 5}, 'customersBySearch');
    this.getCustomers({page: 1, limit: 4}, 'customers');
    this.getCustomers({page: 1, limit: 1}, 'customer');
    this.getCustomerStats();
  }

  onCheck(event){
    if(event.checked){
      this.searchByName = true;
    }else{
      this.searchByName = false;
    }

  }

  onClickSearchBtn() {
    this.showSearchInput = true;

  }

  searchInput(e){
    this.showSearchInput = false;
    this.input1.nativeElement.value = '';
    this.searchByName = false;
    this.getCustomers({page: 1, limit: 5}, 'customersBySearch');
  }

  closeSearchInput() {
    this.showSearchInput = false;
    this.input1.nativeElement.value = '';
    this.searchByName = false;
    this.getCustomers({page: 1, limit: 5}, 'customersBySearch');
  }

  openDeleteCustomerDialog() {
    if(this.customer.name !== null){

      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      let dialog = this.dialog.open(AlertDialogComponent, {
        data : {
          title: 'Delete Customer?',
          subtitle: 'Do you really want to delete this Customer',
          showDangerBtn: true,
          showPrimaryBtn: true,
          dangerBtnName: 'Cancel',
          primaryBtnName: 'Delete'
        }
      });

      // const dialogRef = this.dialog.open(AlertDialogComponent);

      dialog.afterClosed().subscribe(
          data => {
            if(data){
              this.deleteCustomerById(this.customer._id);
            }
          }
      );
    }


  }

  getCustomers(params: {}, f): any{
    this.spinner.show('mainSpinner');
    this.apiService.getCustomersWithQueryParams(params)
      .subscribe((response: any) => {
        this.spinner.hide('mainSpinner');
        console.log('customers', response);
        if(f === 'customersBySearch'){
          this.customersBySearch = response.data;
        }
        else if(f === 'customer'){
          const c = response.data;
          this.customer = c[0];
        }else{
          this.customers = response.data;
        }
      }, error => {
        this.spinner.hide('mainSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');
        console.log(error);

      });
  }

  getCustomersBySearch(params: {}): any{
    this.spinner.show('searchSpinner');
    this.apiService.getCustomersWithQueryParams(params)
      .subscribe((response: any) => {
        this.spinner.hide('searchSpinner');
        console.log('customers', response);
        this.customersBySearch = response.data;
      }, error => {
        this.spinner.hide('searchSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');
        console.log(error);

      });
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
              if(this.input1.nativeElement.value.length > 3){
                if(this.searchByName){
                  this.customersBySearch = this.getCustomersBySearch({'name': (this.input1.nativeElement.value).toLowerCase()});
                }else if(!this.searchByName && this.input1.nativeElement.value.length === 10){
                  this.customersBySearch = this.getCustomersBySearch({'mobileNumber': this.input1.nativeElement.value});
                }
              }
            })
        )
        .subscribe();
  }

  onPaginate(event): any{
    console.log(event);
    this.getCustomers({'page': event.pageIndex + 1, 'limit': event.pageSize}, 'customers');
  }

  onSelect(customer){
    this.customer = customer;
  }

  getCustomerStats(){
    this.spinner.show('mainSpinner');
    this.apiService.getCustomerStats()
      .subscribe((response: any) => {
        this.spinner.hide('mainSpinner');
        if(response){
          this.paginationLength = response.data.stats[0].totalCustomers;
        }
      }, error => {
        console.log(error);
        this.spinner.hide('mainSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');
      })
  }

  deleteCustomerById(id: string){
    this.spinner.show('mainSpinner');
    this.apiService.deleteCustomerById(id)
      .subscribe((response) => {
        this.spinner.hide('mainSpinner');
        this.onStart();
        this.uiService.openSnackBar('Customer Deleted Successfully.', 'Close');
      }, error => {
        console.log(error);
        this.spinner.hide('mainSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');
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
      () => this.onStart()
    );


  }

}
