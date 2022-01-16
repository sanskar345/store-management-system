import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { UiService } from 'src/app/core/services/ui.service';
import { DialogsService } from '../dialogs.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { faBraille, faCalendarAlt, faHashtag, faInfo, faMapMarkerAlt, faPhoneAlt, faPlus, faPlusSquare, faRupeeSign, faSquare, faTimes, faUser, faUserPlus, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { UNIQUE_NUMBER } from 'src/app/core/constants/storage.constant';
import { StorageService } from 'src/app/core/services/storage.service';
import { TitleCasePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddCustomerDialogComponent } from '../add-customer-dialog/add-customer-dialog.component';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';

@Component({
  selector: 'app-create-invoice-dialog',
  templateUrl: './create-invoice-dialog.component.html',
  styleUrls: ['./create-invoice-dialog.component.css']
})
export class CreateInvoiceDialogComponent implements OnInit {

  passedData: any = {
    showModal1: false,
    showModal2: false,
  }
  createInvoiceForm1: FormGroup;
  createInvoiceForm2: FormGroup;

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
  invoiceTotalAmountByTotalItems: number = 0;
  invoiceTotalMrpByTotalItems: number = 0;

  paymentReceived: number;

  discountInAmount: number = 0;
  discountInPercentage: number = 0;

  invoiceForm: FormGroup;
  today : any;
  item: {
    itemNumber: number,
    name: string,
    size: string,
    brand: string,
    rate: string,
    mrp: string,
    quantity: number,
    id: string
  };
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
  customers = [];

  itemsData = [];

  suggestions = [];

  itemSuggestions = [];

  instantPayment: boolean = true;

  invoicePreviewData: any;

  transactionStats: any;

  store: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogtRef: MatDialogRef<CreateInvoiceDialogComponent>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private uiService: UiService,
    private apiService: ApiService,
    private dialogsService: DialogsService,
    private storageService: StorageService,
    private titlecasePipe: TitleCasePipe,
    private spinner: NgxSpinnerService,
    private dialogService: DialogsService
  ) { }

  ngOnInit(): void {
    this.getStore();
    this.passedData = this.data;
    if(this.passedData.showModal2){
      this.invoicePreviewData = this.passedData.invoicePreviewData;
      this.paymentReceived = this.passedData.paymentReceived;
      this.invoiceDetail = this.passedData.invoiceDetail;
      this.instantPayment = this.passedData.instantPayment;
      this.invoiceTotalAmountByTotalItems = this.passedData.invoiceTotalAmountByTotalItems;
      this.invoiceTotalMrpByTotalItems = this.passedData.invoiceTotalMrpByTotalItems;
      this.discountInAmount = this.passedData.discountInAmount;

    }else{
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
    }
    // this.buildForms();
    console.log(this.passedData);


    this.today = new Date;
    this.buildForms();
    //hit apis --

    this.getCustomers();
    this.getItems();



    this.invoiceForm.get('items').valueChanges
      .subscribe((value) => {
        this.calculateInvoiceTotalAmountByTotalItems();
        this.calculateInvoiceTotalMrpByTotalItems();
        this.calculateDiscountInAmount();
        this.calculateDiscountInPercentage();
      });

      this.invoiceForm.get('roundOff').valueChanges
      .subscribe((value) => {
        if(value === true){
          this.roundOffTotalAmount();
        }

      });

    this.getTransactionStat();
  }

  close(){
    this.dialogtRef.close('add');
  }

  openSecondDialog(invoicePreviewData: any, paymentReceived: any, invoiceDetail: any, invoiceTotalAmountByTotalItems: any, instantPayment: any, invoiceTotalMrpByTotalItems: any, discountInAmount: any) {

    this.close();

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(CreateInvoiceDialogComponent, {
      width: '100vw',
      data : {
        showModal1: false,
        showModal2: true,
        invoicePreviewData,
        paymentReceived,
        invoiceDetail,
        invoiceTotalAmountByTotalItems,
        instantPayment,
        discountInAmount,
        invoiceTotalMrpByTotalItems
      }
    });

    // const dialogRef = this.dialog.open(AlertDialogComponent);

    dialog.afterClosed().subscribe(
        data => console.log("Dialog output:", data)
    );


  }

  buildForms(){
    this.invoiceForm = this.formBuilder.group({
      customerMobileNumberInput: [''],
      invoiceNumber: ['', Validators.required],
      invoiceDate: [ this.today.toLocaleDateString(), Validators.required],
      items: this.formBuilder.array([]),
      paymentReceived: [''],
      roundOff: [],
      paymentMode: ['', Validators.required]
    })
  };

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
  }

  //form array functions --

  addItem(){
    const formControl = this.formBuilder.group({
      name: [''],
      size: [''],
      rate: [''],
      mrp: [''],
      stockQuantity: [''],
      quantity: [''],
      purchasePrice: [''],
      _id: ['']

    });
    (<FormArray>this.invoiceForm.get('items')).push(formControl);
  };

  addItemByData(formControl){
    (<FormArray>this.invoiceForm.get('items')).push(formControl);
  };

  get items() : FormArray {
    return this.invoiceForm.get("items") as FormArray
  }

  newItem(): FormGroup {
    return this.formBuilder.group({
      name: [],
      size: [],
      rate: [],
      mrp: [],
      stockQuantity: [],
      quantity: [],
      purchasePrice: [],
      _id: []
    })
  }

  // addItems() {
  //   this.emergencyContacts.push(this.newEmergencyContact());
  // }

  // loadEmergencyContact(){
  //   this.emergencyContact.forEach((emergencyContact) => {
  //     this.addPreLoadedEmergencyContact(emergencyContact);
  //   });
  // };

  // addPreLoadedEmergencyContact(emergencyContact: {
  //   name: string,
  //   number: string
  //   }){

  //   const newFormGroup = this.formBuilder.group(emergencyContact)
  //   this.emergencyContacts.push(newFormGroup);
  // };

  removeItemFromFormArray(i:number) {
    this.items.removeAt(i);
  };

  //...........


  // item search functinality and controls --

  suggestItems(event){
    this.itemSuggestions = this.searchItemsAndFilterData(event, this.itemsData);
  }

  private searchItemsAndFilterData(event, items){
    const newSuggestions = [];
    const value = event.target.value.toLowerCase().trim();
    items.forEach((item: any) => {
      let name = item.name.toLowerCase();

      if(name.includes(value)){
        newSuggestions.push(item);
      }
    });
    return newSuggestions.slice(0, 5);

  };

  addItemToFormArray(index){

    const formControl = this.formBuilder.group({
      name: [this.itemSuggestions[index].name],
      size: [this.itemSuggestions[index].size],
      rate: [this.itemSuggestions[index].rate],
      mrp: [this.itemSuggestions[index].mrp],
      stockQuantity: [this.itemSuggestions[index].quantity],
      quantity: [1],
      purchasePrice: [this.itemSuggestions[index].purchasePrice],
      _id: [this.itemSuggestions[index]._id]
    });

    if(this.checkIfItemExistOnFormArray(this.itemSuggestions[index].name) === false){
      this.addItemByData(formControl);
    }

  }

  checkIfItemExistOnFormArray(name: string){
    let condition: boolean = false;
    this.invoiceForm.get('items').value.forEach( (item) => {

      if(item.name === name){
        condition = true;
      }
    });
    return condition;
  }

  // .........

  calculateInvoiceTotalAmountByTotalItems(){
    this.invoiceTotalAmountByTotalItems = 0;
    this.invoiceForm.get('items').value.forEach( (item) => {
      for(let i=1; i<=Number(item.quantity); i++){
        this.invoiceTotalAmountByTotalItems += Number(item.rate);
      }
    });
    this.invoiceTotalAmountByTotalItems = Number(this.invoiceTotalAmountByTotalItems.toFixed(2));
  };

  calculateInvoiceTotalMrpByTotalItems(){
    this.invoiceTotalMrpByTotalItems = 0;
    this.invoiceForm.get('items').value.forEach( (item) => {
      for(let i=1; i<=Number(item.quantity); i++){
        this.invoiceTotalMrpByTotalItems += Number(item.mrp);
      }
    });
    this.invoiceTotalMrpByTotalItems = Number(this.invoiceTotalMrpByTotalItems.toFixed(2));
  };

  toggleInstantPayment(){
    this.instantPayment = !this.instantPayment;
    if(!this.instantPayment){
      console.log(' true');
      this.invoiceForm.controls.paymentMode.disable();
      this.invoiceForm.controls.paymentMode.clearValidators();
    }else{
      console.log('not true');
      this.invoiceForm.get('paymentMode').setValidators([Validators.required]);
      this.invoiceForm.controls.paymentMode.enable();
    }
  }

  roundOffTotalAmount(){
    this.invoiceTotalAmountByTotalItems = Math.round(this.invoiceTotalAmountByTotalItems);

  }


  //discount ----

  calculateDiscountInAmount(){
    this.discountInAmount = this.invoiceTotalMrpByTotalItems - this.invoiceTotalAmountByTotalItems;
    this.discountInAmount = Number(this.discountInAmount.toFixed(2));
  }

  calculateDiscountInPercentage(){
    const n = this.discountInAmount / this.invoiceTotalMrpByTotalItems;
    this.discountInPercentage = n*100;
    this.discountInPercentage = Number(this.discountInPercentage.toFixed(2));
  }

  //........



  // pdf make

  generatePDF() {

    const products = [
      {
        name: 'dasd',
        price: 88,
        qty: 9
      }
    ]

    let docDefinition = {
      content: [
        {
          text: this.transformToTitlecase(this.store.name),
          fontSize: 16,
          alignment: 'center',
          color: '#047886',
          decoration: 'underline'
        },
        {
          text: 'INVOICE',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
        },
        {
          text: 'Customer Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: 'Name : ' + this.transformToTitlecase(this.invoiceDetail.customer.name) ,
                bold:true
              },
              { text: 'Mobile : ' + this.invoiceDetail.customer.mobileNumber},
              { text: 'Address :' + this.transformToTitlecase(this.invoiceDetail.customer.address) },

            ],
            [
              {
                text: 'Invoice Date : ' + this.getCurrentDate(),
                alignment: 'right'
              },
              {
                text: `Invoice Number : ${this.getInvoiceNumber()}`,
                alignment: 'right'
              }
            ]
          ]
        },
        {
          text: '',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto','*', 'auto', 'auto', 'auto', 'auto'],
            body: this.getItemArrayForPDF()
          }
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto','*'],
            body: [
              [ { text: 'Grand Total', bold: true }, `₹${this.invoiceTotalMrpByTotalItems}`],
              [ { text: 'Discount', bold: true }, `₹${this.discountInAmount}`],
              [ { text: 'Net Amount', bold: true }, `₹${this.invoiceTotalAmountByTotalItems}`],
              [ { text: 'Paid', bold: true }, `₹${this.paymentReceived}`],


            ],
            margin: [0, 20],
          }
        },

        {
          text: '',
          style: 'sectionHeader'
        },

        {
          columns: [

            [{ text: 'Authorised Signature', alignment: 'right', italics: true}],
          ]
        },
        {
          text: 'Terms and Conditions',
          style: 'sectionHeader'
        },
        {
            ul: [
              'Warrenty of the product will be subject to the manufacturer terms and conditions.',
              'This is system generated invoice.',
            ],
        },
        {
          text: `Complaint Number: ${this.store.storeContactNumber}`,
          style: 'sectionHeader',
          alignment: 'center'
        },
        {
          text: [
            'Thank You Visit Again'
            ],
          style: 'header',
          bold: false ,
          alignment: 'center'
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15,0, 15]
        }
      }
    };

    pdfMake.createPdf(docDefinition).print();

    // this.invoiceForm.reset();
    // this.items.clear();
    // this.invoiceDetail.customer = {
    //   address: null,
    //   adminIdFk: null,
    //   createdAt: null,
    //   credit:  null,
    //   dob: null,
    //   mobileNumber: null,
    //   name: null,
    //   _id: null,
    //   billsWithCredit: null
    // }
    this.close();

  };

  //.......

  onGoToSecondModal(){
    console.log('in', this.invoiceDetail);

    if(this.instantPayment === true){
      this.openSecondDialog(this.invoiceForm.value, this.invoiceTotalAmountByTotalItems, this.invoiceDetail, this.invoiceTotalAmountByTotalItems, this.instantPayment, this.invoiceTotalMrpByTotalItems, this.discountInAmount);
    }
    else if(this.instantPayment === false){
      this.openSecondDialog(this.invoiceForm.value, 0, this.invoiceDetail, this.invoiceTotalAmountByTotalItems, this.instantPayment, this.invoiceTotalMrpByTotalItems, this.discountInAmount);
    }

  };

  //get customers

  getCustomers(){
    this.spinner.show('mainSpinner');
    this.apiService.getCustomers()
      .subscribe((response: any) => {
        this.spinner.hide('mainSpinner');
        console.log('customers', response);
        this.customers = response.data;
        this.suggestions = this.customers.slice(0, 2);

      }, error => {
        this.spinner.hide('mainSpinner');
        console.log(error);

      });
  }

  // get items

  getItems(){
    this.spinner.show('mainSpinner');
    this.apiService.getItemsByParams({'quantity[gt]': 0}).subscribe((response: any) => {
      this.spinner.hide('mainSpinner');
      console.log('items', response);
      this.itemsData = response.data;
      this.itemSuggestions = this.itemsData.slice(0,5);
    }, error => {
      this.spinner.hide('mainSpinner');
      console.log(error);

    })
  }

  //hit api to create transaction

  createTransaction(data: any){
    this.spinner.show('mainSpinner');
    this.apiService.createTransaction(data).subscribe((response: any) => {
      this.spinner.hide('mainSpinner');
      if(response){
        if(this.instantPayment !== true){
          const id = response.data.item._id;
          const creditAmount = response.data.item.creditAmount;
          let billsWithCreditArray = this.invoiceDetail.customer.billsWithCredit;
          billsWithCreditArray.push(id);
          const data = {
            credit: this.invoiceDetail.customer.credit + creditAmount,
            billsWithCredit: billsWithCreditArray
          }
          this.updateCustomerById(data, this.invoiceDetail.customer._id);
        }else{
          this.uiService.openSnackBar('Transaction done successfully', 'Close');
          this.generatePDF();
        }

      }
    }, error => {
      this.spinner.hide('mainSpinner');
      this.uiService.openSnackBar(error.error.message, 'Close');
      console.log(error);

    });
  }

  // create invoice

  createInvoice(){
    console.log('invoicePreviewData',this.invoicePreviewData);
    console.log('this.paymentReceived', this.paymentReceived);
    console.log('this.invoiceDetail', this.invoiceDetail);
    console.log('thi', this.invoicePreviewData.items);

    let profit = 0;
    this.invoicePreviewData.items.forEach((item) => {
      const newQuantity = item.stockQuantity - item.quantity;
      if(newQuantity < 0){
        this.uiService.openSnackBar('The selected Items are not in quantity!', 'Close');
        this.close();
        return;
      }
      this.updateItemWithId({quantity: newQuantity}, item._id);
      profit += item.rate - item.purchasePrice;

    });

    let data: any;



    if(this.instantPayment === true){
      data = {
        "partyName": this.invoiceDetail.customer.name,
        "profit": profit,
        "status": "COMPLETE",
        "totalCustomerCredit": this.invoiceDetail.customer.credit,
        "creditAmount": 0,
        "transactionType": "SALE",
        "customerId": this.invoiceDetail.customer._id,
        "totalAmount": this.invoiceTotalAmountByTotalItems,
        "paymentMode": this.invoicePreviewData.paymentMode,
        "items": this.invoicePreviewData.items,
        "partyMobileNumber": this.invoiceDetail.customer.mobileNumber,
        "dateTime": (new Date()).toISOString(),
        "paymentIn": 0,
        "paymentOut": 0
      }

    }else{
      data = {
        "partyName": this.invoiceDetail.customer.name,
        "profit": 0,
        "status": "CREDIT",
        "totalCustomerCredit": this.invoiceDetail.customer.credit,
        "creditAmount": this.invoiceTotalAmountByTotalItems,
        "transactionType": "SALE",
        "customerId": this.invoiceDetail.customer._id,
        "totalAmount": this.invoiceTotalAmountByTotalItems,
        "items": this.invoicePreviewData.items,
        "partyMobileNumber": this.invoiceDetail.customer.mobileNumber,
        "dateTime": (new Date()).toISOString(),
        "paymentIn": 0,
        "paymentOut": 0
      }
    }

    if(this.transactionStats?.totalTransactions){
      Object.assign(data, {"invoiceOrBillNumber":  this.storageService.getAdminIdFk() + '#N' + (this.transactionStats.totalTransactions + UNIQUE_NUMBER + 1).toString(),
      "transactionNumber": this.storageService.getAdminIdFk()  + '#N' + (this.transactionStats.totalTransactions + 1).toString()});
    }else{
      Object.assign(data, {"invoiceOrBillNumber": this.storageService.getAdminIdFk()  + '#N' + (UNIQUE_NUMBER + 1).toString(),
      "transactionNumber":  this.storageService.getAdminIdFk()  + '#N' +  '1'});
    }

    this.createTransaction(data);

  }

  getTransactionStat(){
    this.spinner.show('mainSpinner');
    this.apiService.getTransactionStat()
      .subscribe((response: any) => {
        this.spinner.hide('mainSpinner');
        this.transactionStats = response.data.stats[0];
        console.log('stats: ', this.transactionStats);
        if(this.transactionStats?.totalTransactions){
          this.invoiceForm.patchValue({ invoiceNumber: this.transactionStats.totalTransactions + UNIQUE_NUMBER + 1 });
        }else{
          this.invoiceForm.patchValue({ invoiceNumber: UNIQUE_NUMBER + 1 });
        }
      }, error => {
        this.spinner.hide('mainSpinner');
        console.log(error);
        this.uiService.openSnackBar(error.error.message, 'Close');
      });
  }

  updateItemWithId(data, id: string){
    this.spinner.show('mainSpinner');
    this.apiService.updateItemWithId(data, id)
      .subscribe((response) => {
        this.spinner.hide('mainSpinner');
        console.log(response);

      }, error => {
        this.spinner.hide('mainSpinner');
        console.log(error);
        this.uiService.openSnackBar(error.error.message, 'Close');
      });
  }

  updateCustomerById(data, id: string){
    this.spinner.show('mainSpinner');
    this.apiService.updateCustomerById(data, id)
      .subscribe((response) => {
        this.spinner.hide('mainSpinner');
        if(response){
          console.log('updated customer',response);
          this.uiService.openSnackBar('Transaction done on CREDIT is successful', 'Close');
          this.generatePDF();
        }
      }, error => {
        this.spinner.hide('mainSpinner');
        console.log(error);
        this.uiService.openSnackBar(error.error.message, 'Close');
      });
  }

  getCurrentDate(){
    return ((new Date()).toISOString()).split('T')[0];
  }

  getInvoiceNumber(){
    if(this.transactionStats?.totalTransactions){
      return this.transactionStats.totalTransactions + UNIQUE_NUMBER + 1;
    }else{
      return UNIQUE_NUMBER + 1 ;
    }
  }

  getItemArrayForPDF(){
    let array = [];
    array.push([ { text: 'S.No.', bold: true }, { text: 'Item Name', bold: true }, { text: 'Quantity', bold: true }, { text: 'MRP', bold: true }, { text: 'Rate', bold: true }, { text: 'Amount', bold: true } ]);

    this.invoicePreviewData.items.forEach((item, index) => {
      array.push([index + 1, item.name, item.quantity, `₹${item.mrp}`, `₹${item.rate}`, `₹${item.rate*item.quantity}`]);
    });
    return array;
    }

  transformToTitlecase(str: string){
    return this.titlecasePipe.transform(str);
  }

  getStore(){
    this.spinner.show('mainSpinner');
    this.apiService.getStore()
      .subscribe((response: any) => {
        this.spinner.hide('mainSpinner');
        if(response){
          console.log(response);

          this.store = response.data[0]
        }
      }, error => {
        console.log(error);
        this.spinner.hide('mainSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');
      })
  }

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
      () => {}
    );


  }

  //open Add item dialog

  openAddItemDialog() {
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
        () => {}
    );


  }

}
