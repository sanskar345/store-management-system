import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { UiService } from 'src/app/core/services/ui.service';
import { DialogsService } from '../dialogs.service';
import { faBraille, faCalendarAlt, faHashtag, faInfo, faMapMarkerAlt, faPhoneAlt, faPlus, faPlusSquare, faRupeeSign, faSquare, faTimes, faUser, faUserPlus, faUserTie } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-receive-customer-credit-dialog',
  templateUrl: './receive-customer-credit-dialog.component.html',
  styleUrls: ['./receive-customer-credit-dialog.component.css']
})
export class ReceiveCustomerCreditDialogComponent implements OnInit {

  faUserPlus = faUserPlus;
  faPlusSquare = faPlusSquare;
  faTimes = faTimes;
  faRupeeSign = faRupeeSign;
  faSquare = faSquare;
  faUser = faUser;
  faPlus = faPlus;
  faPhoneAlt = faPhoneAlt;
  faUserTie = faUserTie;
  faMapMarkerAlt = faMapMarkerAlt;
  faCalendarAlt = faCalendarAlt;
  faInfo = faInfo;
  faHashtag = faHashtag;
  customers = [];
  suggestions = [];
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

  passedData: any = {
    showModal1: false,
    showModal2: false,
  }
  invoiceForm: FormGroup;
  creditTransactionArray = [];
  totalCredit = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogtRef: MatDialogRef<ReceiveCustomerCreditDialogComponent>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private uiService: UiService,
    private apiService: ApiService,
    private dialogsService: DialogsService
  ) { }

  ngOnInit(): void {
    this.passedData = this.data;
    this.buildForms();
    this.getCustomers();
    if(this.invoiceDetail.customer.name !== null){
      this.pushTransactionInArray();
    }
    console.log(this.passedData);
  }

  close(){
    this.dialogtRef.close('add');
  }

  buildForms(){
    this.invoiceForm = this.formBuilder.group({
      customerMobileNumberInput: [''],
      invoiceDate: ['', Validators.required],
      invoiceNumber: ['', Validators.required],
    })
  }

  openSecondDialog() {

    this.close();

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(ReceiveCustomerCreditDialogComponent, {
      width: '500px',
      data : {
        showModal1: false,
        showModal2: true,
      }
    });

    // const dialogRef = this.dialog.open(AlertDialogComponent);

    dialog.afterClosed().subscribe(
        data => console.log("Dialog output:", data)
    );


  }

  suggest(event){
    // console.log(event.target.value);

    this.suggestions = this.searchAndFilterData(event, this.customers)
  }

  private searchAndFilterData(event, customers){
    const newSuggestions = [];
    const value = event.target.value.toLowerCase().trim();
    customers.forEach((customer: any) => {
      let mobileNumber = customer.mobileNumber.toLowerCase();

      if(mobileNumber.includes(value)){
        newSuggestions.push(customer);
      }
    });
    return newSuggestions.slice(0, 2);

  };

  addCustomerToInvoiceDetail(index){
    console.log(this.invoiceDetail['customer']);
    this.invoiceDetail['customer'] = this.suggestions[index];
    console.log(this.suggestions[index]);
    console.log(this.invoiceDetail['customer']);
    this.pushTransactionInArray();

  }

  pushTransactionInArray(){
    this.creditTransactionArray = [];
    if(this.invoiceDetail.customer.name !== null || this.invoiceDetail.customer.name !== ""){
      this.invoiceDetail.customer.billsWithCredit.forEach((id) => {
        this.getTransactionById(id);
      });
    }

  }

  getTotalCredit(){
    this.totalCredit = 0;
    this.creditTransactionArray.forEach((transaction) => {
      this.totalCredit += transaction.transaction.creditAmount;
    })
    console.log(this.totalCredit);

  }

  clearTransactionArray(){
    this.creditTransactionArray = [];
    this.getTotalCredit();
  }

  removeCustomerFromInvoiceDetail(){
    this.invoiceDetail.customer = {
      address: null,
      adminIdFk: null,
      createdAt: null,
      credit:  null,
      dob: null,
      mobileNumber: null,
      name: null,
      _id: null,
      billsWithCredit: null
    };
    this.clearTransactionArray();
  }

  //get customers

  getCustomers(){
    this.apiService.getCustomers()
      .subscribe((response: any) => {
        console.log('customers', response);
        this.customers = response.data;
        this.suggestions = this.customers.slice(0, 2);

      }, error => {
        this.uiService.openSnackBar(error.error.message, 'Close');
        console.log(error);

      });
  }

  getTransactionById(id: string){
    this.apiService.getTransactionById(id)
      .subscribe((response: any) => {
        if(response){
          this.creditTransactionArray.push(response.data);
          console.log('array:', this.creditTransactionArray);
          this.getTotalCredit();
        }
      }, error => {
        this.uiService.openSnackBar(error.error.message, 'Close');
        console.log(error);
      });
  }

}
