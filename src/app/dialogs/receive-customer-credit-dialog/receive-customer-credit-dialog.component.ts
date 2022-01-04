import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  suggestions: any;
  invoiceDetail = {
    customer:  {
      name: null,
      mobileNumber: null,
      address: null,
      id: null
    }
  };

  passedData: any = {
    showModal1: false,
    showModal2: false,
  }
  addItemForm1: FormGroup;

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
    console.log(this.passedData);
  }

  close(){
    this.dialogtRef.close('add');
  }

  buildForms(){
    this.addItemForm1 = this.formBuilder.group({
      name: ['', Validators.required],
      mrp: ['', Validators.required],
      rate: ['', Validators.required],
      purchasePrice: ['', Validators.required],
      brand: ['', Validators.required]
    })
    this.addItemForm2 = this.formBuilder.group({
      category: ['', Validators.required],
      size: ['', Validators.required],
      quantity: ['', Validators.required],
      expiryDate: [''],
      manufacturerDate: ['']
    })
  }

  openSecondDialog() {

    this.close();

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(AddItemDialogComponent, {
      width: '500px',
      data : {
        showModal1: false,
        showModal2: true,
        form1Data: {
          "name": this.addItemForm1.get('name').value,
          "rate": this.addItemForm1.get('rate').value,
          "mrp": this.addItemForm1.get('mrp').value,
          "purchasePrice": this.addItemForm1.get('purchasePrice').value,
          "brand": this.addItemForm1.get('brand').value
        }
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


  }

  removeCustomerFromInvoiceDetail(){
    this.invoiceDetail.customer = {
      name: null,
      mobileNumber: null,
      address: null,
      id: null
    };
  }

  //get customers

  getCustomers(){
    this.apiService.getCustomers()
      .subscribe((response: any) => {
        console.log('customers', response);
        this.customers = response.data;
        this.suggestions = this.customers.slice(0, 2);

      }, error => {
        console.log(error);

      });
  }

}
