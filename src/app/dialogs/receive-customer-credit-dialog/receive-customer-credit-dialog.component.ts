import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { UiService } from 'src/app/core/services/ui.service';
import { DialogsService } from '../dialogs.service';
import { faBraille, faCalendarAlt, faHashtag, faInfo, faMapMarkerAlt, faPhoneAlt, faPlus, faPlusSquare, faRupeeSign, faSquare, faTimes, faUser, faUserPlus, faUserTie } from '@fortawesome/free-solid-svg-icons';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TitleCasePipe } from '@angular/common';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TransactionDetailsBottomSheetComponent } from 'src/app/bottom-sheets/transaction-details-bottom-sheet/transaction-details-bottom-sheet.component';
import { NgxSpinnerService } from 'ngx-spinner';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  particularTransaction: any;
  today: String;
  store: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogtRef: MatDialogRef<ReceiveCustomerCreditDialogComponent>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private uiService: UiService,
    private apiService: ApiService,
    private dialogsService: DialogsService,
    private titlecasePipe: TitleCasePipe,
    private bottomSheet: MatBottomSheet,
    private spinner: NgxSpinnerService,
    private dialogService: DialogsService
  ) { }

  ngOnInit(): void {
    this.getStore();
    this.today = ((new Date()).toISOString()).split('T')[0];
    this.passedData = this.data;
    if(this.passedData.invoiceDetail && this.passedData.showModal1){
      this.invoiceDetail = this.passedData.invoiceDetail;
    }
    this.buildForms();
    this.getCustomers();
    if(this.invoiceDetail.customer.name !== null){
      this.pushTransactionInArray();
    }
    if(this.passedData.showModal2){
      this.invoiceDetail = this.passedData.invoiceDetail;
      this.particularTransaction = this.passedData.particularTransaction;
    }
  }

  close(){
    this.dialogtRef.close('add');
  }

  buildForms(){
    this.invoiceForm = this.formBuilder.group({
      customerMobileNumberInput: [''],
      invoiceDate: [this.today, Validators.required],
      // invoiceNumber: ['', Validators.required],
    })
  }

  openSecondDialog(invoiceDetail: any, particularTransaction: any) {

    this.close();

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(ReceiveCustomerCreditDialogComponent, {
      width: '100vw',
      data : {
        showModal1: false,
        showModal2: true,
        invoiceDetail,
        particularTransaction
      }
    });

    // const dialogRef = this.dialog.open(AlertDialogComponent);

    dialog.afterClosed().subscribe(
        data => {}
    );


  }

  suggest(event){

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
    this.invoiceDetail['customer'] = this.suggestions[index];
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
    this.spinner.show('mainSpinner');
    this.apiService.getCustomers()
      .subscribe((response: any) => {
        this.spinner.hide('mainSpinner');
        this.customers = response.data;
        this.suggestions = this.customers.slice(0, 2);

      }, error => {
        this.spinner.hide('mainSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');

      });
  }

  getTransactionById(id: string){
    this.spinner.show('mainSpinner');
    this.apiService.getTransactionById(id)
      .subscribe((response: any) => {
        this.spinner.hide('mainSpinner');
        if(response){
          this.creditTransactionArray.push(response.data);
          this.getTotalCredit();
        }
      }, error => {
        this.spinner.hide('mainSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');
      });
  }

  addPaymentAndClearBill(transaction){
    this.openSecondDialog(this.invoiceDetail, transaction);
  }

  updateTransactionById(id: string, data: any){
    this.spinner.show('mainSpinner');
    this.apiService.updateTransactionById(id, data)
      .subscribe((response: any) => {
        this.spinner.hide('mainSpinner');
        if(response){
          const id = response.data.updatedTransaction._id;
          const paymentAmount = response.data.updatedTransaction.totalAmount;
          let billsWithCreditArray = this.invoiceDetail.customer.billsWithCredit;
          this.invoiceDetail.customer.billsWithCredit.forEach((credit, index) => {
            if(credit === id){
              billsWithCreditArray.splice(index, 1);
            }
          });
          const data = {
            credit: this.invoiceDetail.customer.credit - paymentAmount,
            billsWithCredit: billsWithCreditArray
          }
          this.updateCustomerById(data, this.invoiceDetail.customer._id);
        }
      }, error => {
        this.spinner.hide('mainSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');
      })
  }

  clearPayment(){

    let profit = 0;
    this.particularTransaction.items.forEach((item) => {
      profit += item.rate - item.purchasePrice;
    })

    const data = {
      "profit": profit,
      "totalAmount": this.particularTransaction.totalAmount,
      "status": "PAID",
      "creditAmount": 0,
      "dateTime": (new Date()).toISOString(),
    }

    this.updateTransactionById(this.particularTransaction._id, data);
  }

  updateCustomerById(data, id: string){
    this.spinner.show('mainSpinner');
    this.apiService.updateCustomerById(data, id)
      .subscribe((response) => {
        this.spinner.hide('mainSpinner');
        if(response){
          this.uiService.openSnackBar('Transaction done successfully', 'Close');
          this.generatePDF();
        }
      }, error => {
        this.spinner.hide('mainSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');
      });
  }

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
                  text: 'Purchase Date : ' + this.getPurchaseDate(),
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
               [ { text: 'Net Amount', bold: true }, `₹${this.particularTransaction.totalAmount}`],
                [ { text: 'Bill cleared and payment done of', bold: true }, `₹${this.particularTransaction.totalAmount}`],


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

    transformToTitlecase(str: string){
      return this.titlecasePipe.transform(str);
    }

    getInvoiceNumber(){
      return this.particularTransaction.invoiceOrBillNumber.split('#N')[1];
    }

    getCurrentDate(){
      return ((new Date()).toISOString()).split('T')[0];
    }

    getItemArrayForPDF(){
      let array = [];
      array.push([ { text: 'S.No.', bold: true }, { text: 'Item Name', bold: true }, { text: 'Quantity', bold: true }, { text: 'MRP', bold: true }, { text: 'Rate', bold: true }, { text: 'Amount', bold: true } ]);

      this.particularTransaction.items.forEach((item, index) => {
        array.push([index + 1, item.name, item.quantity, `₹${item.mrp}`, `₹${item.rate}`, `₹${item.rate*item.quantity}`]);
      });
      return array;
      }

    getPurchaseDate(){
      return this.particularTransaction.dateTime.split('T')[0];
    }

    openTransactionDetailBottomSheet(transaction){
      const bottomSheetRef = this.bottomSheet.open(TransactionDetailsBottomSheetComponent, {
        panelClass: 'transaction-details-bottom-sheet',
        data: {
          transaction
         },
      });

      bottomSheetRef.afterDismissed().subscribe(() => {
      });

    }

    getStore(){
      this.spinner.show('mainSpinner');
      this.apiService.getStore()
        .subscribe((response: any) => {
          this.spinner.hide('mainSpinner');
          if(response){

            this.store = response.data[0]
          }
        }, error => {
          this.spinner.hide('mainSpinner');
          this.uiService.openSnackBar(error.error.message, 'Close');
        })
    }

}
