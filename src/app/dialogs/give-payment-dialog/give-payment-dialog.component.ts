import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { UiService } from 'src/app/core/services/ui.service';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';
import { DialogsService } from '../dialogs.service';
import { faCalendarAlt, faFileInvoice, faHashtag, faInfo, faPhoneAlt, faRupeeSign, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { MOBILE_REGEX, ONLY_LETTERS } from 'src/app/core/constants/regex.constant';
import { UNIQUE_NUMBER } from 'src/app/core/constants/storage.constant';
import { StorageService } from 'src/app/core/services/storage.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { NgxSpinnerService } from 'ngx-spinner';
import { TitleCasePipe } from '@angular/common';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-give-payment-dialog',
  templateUrl: './give-payment-dialog.component.html',
  styleUrls: ['./give-payment-dialog.component.css']
})
export class GivePaymentDialogComponent implements OnInit {

  faRupeeSign = faRupeeSign;
  faCalendarAlt = faCalendarAlt;
  faHashtag = faHashtag;
  faUserTie = faUserTie;
  faPhoneAlt = faPhoneAlt;
  faFileInvoice = faFileInvoice;
  faInfo = faInfo;

  passedData: any = {
    showModal1: false,
    showModal2: false,
  }
  givepaymentForm: FormGroup;
  today: string;
  totalAmount: number;
  transactionStats: any;
  store: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogtRef: MatDialogRef<AddItemDialogComponent>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private uiService: UiService,
    private apiService: ApiService,
    private dialogsService: DialogsService,
    private storageService: StorageService,
    private spinner: NgxSpinnerService,
    private titlecasePipe: TitleCasePipe,
    private dialogService: DialogsService
  ) { }

  ngOnInit(): void {
    this.getStore();
    this.today = ((new Date()).toISOString()).split('T')[0];
    this.passedData = this.data;
    if(this.passedData.showModal2){
      this.givepaymentForm = this.passedData.givepaymentForm;
      this.totalAmount = this.passedData.totalAmount;
      this.today = this.passedData.today;
    }else{
      this.buildForms();
    }
    this.getTransactionStat();
    console.log(this.passedData);
  }

  close(){
    this.dialogtRef.close('add');
  }

  buildForms(){
    this.givepaymentForm = this.formBuilder.group({
      partyName: ['', [Validators.required, Validators.pattern(ONLY_LETTERS), Validators.minLength(3)]],
      partyMobileNumber: ['', [Validators.required, Validators.pattern(MOBILE_REGEX)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      billNumber: ['', Validators.required],
      date: [this.today, Validators.required],
      paymentOut: ['', Validators.required],
      paymentMode: ['', Validators.required]
    })
  }

  openSecondDialog(givepaymentForm: FormGroup, totalAmount: Number, today: String) {

    this.close();

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(GivePaymentDialogComponent, {
      width: '100vw',
      data : {
        showModal1: false,
        showModal2: true,
        givepaymentForm,
        totalAmount,
        today
      }
    });

    // const dialogRef = this.dialog.open(AlertDialogComponent);

    dialog.afterClosed().subscribe(
        data => console.log("Dialog output:", data)
    );


  }

  onPaymentOutInput(event){
    this.totalAmount = event.target.value;

  }

  getTransactionStat(){
    this.spinner.show('mainSpinner');
    this.apiService.getTransactionStat()
      .subscribe((response: any) => {
        this.spinner.hide('mainSpinner');
        this.transactionStats = response.data.stats[0];
        console.log('stats: ', this.transactionStats);
        if(this.transactionStats?.totalTransactions){
          this.givepaymentForm.patchValue({ billNumber: this.transactionStats.totalTransactions + UNIQUE_NUMBER + 1 });
        }else{
          this.givepaymentForm.patchValue({ billNumber: UNIQUE_NUMBER + 1 });
        }
      }, error => {
        this.spinner.hide('mainSpinner');
        console.log(error);
        this.uiService.openSnackBar(error.error.message, 'Close');
      });
  }

  //hit api to create transaction

  createTransaction(){
    this.spinner.show('mainSpinner');
    const data = {
      "partyName": (this.givepaymentForm.get('partyName').value).toLowerCase(),
      "profit": 0,
      "status": "COMPLETE",
      "totalCustomerCredit": 0,
      "creditAmount": 0,
      "transactionType": "PAYMENTOUT",
      "totalAmount": this.totalAmount,
      "paymentMode": this.givepaymentForm.get('paymentMode').value,
      "partyMobileNumber": this.givepaymentForm.get('partyMobileNumber').value,
      "dateTime": (new Date()).toISOString(),
      "paymentIn": 0,
      "paymentOut": this.totalAmount
    }

    if(this.transactionStats?.totalTransactions){
      Object.assign(data, {"invoiceOrBillNumber":  this.storageService.getAdminIdFk() + '#N' + (this.transactionStats.totalTransactions + UNIQUE_NUMBER + 1).toString(),
      "transactionNumber": this.storageService.getAdminIdFk()  + '#N' + (this.transactionStats.totalTransactions + 1).toString()});
    }else{
      Object.assign(data, {"invoiceOrBillNumber": this.storageService.getAdminIdFk()  + '#N' + (UNIQUE_NUMBER + 1).toString(),
      "transactionNumber":  this.storageService.getAdminIdFk()  + '#N' +  '1'});
    }

    this.apiService.createTransaction(data).subscribe((response: any) => {
      this.spinner.hide('mainSpinner');
      if(response){

        this.uiService.openSnackBar('Transaction done successfully', 'Close');
        this.generatePDF();

      }
    }, error => {
      this.spinner.hide('mainSpinner');
      this.uiService.openSnackBar(error.error.message, 'Close');
      console.log(error);

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
          text: 'Receiver Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: 'Name : ' + this.givepaymentForm.get('partyName').value ,
                bold:true
              },
              { text: 'Mobile : ' + this.givepaymentForm.get('partyMobileNumber').value},
            ],
            [
              {
                text: 'Invoice Date : ' + this.today,
                alignment: 'right'
              },
              {
                text: `Bill Number : ${this.givepaymentForm.get('billNumber').value}`,
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
            widths: ['auto','*'],
            body: [
              [ { text: 'Payment Received', bold: true }, `₹${this.totalAmount}`],

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

    this.close();

  };

  goToSeccondModal(){
    this.openSecondDialog(this.givepaymentForm, this.totalAmount, this.today);
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

}
