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

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogtRef: MatDialogRef<AddItemDialogComponent>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private uiService: UiService,
    private apiService: ApiService,
    private dialogsService: DialogsService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
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
    this.apiService.getTransactionStat()
      .subscribe((response: any) => {
        this.transactionStats = response.data.stats[0];
        console.log('stats: ', this.transactionStats);
        if(this.transactionStats?.totalTransactions){
          this.givepaymentForm.patchValue({ billNumber: this.transactionStats.totalTransactions + UNIQUE_NUMBER + 1 });
        }else{
          this.givepaymentForm.patchValue({ billNumber: UNIQUE_NUMBER + 1 });
        }
      }, error => {
        console.log(error);
        this.uiService.openSnackBar(error.error.message, 'Close');
      });
  }

  //hit api to create transaction

  createTransaction(){

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
      "dateTime": this.today,
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
      if(response){

        this.uiService.openSnackBar('Transaction done successfully', 'Close');
        this.generatePDF();

      }
    }, error => {
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
          text: 'Store Name',
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
          text: 'Complaint Number: 8852852852',
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

}