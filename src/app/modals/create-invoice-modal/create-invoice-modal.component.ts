import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faBraille, faCalendarAlt, faHashtag, faInfo, faMapMarkerAlt, faPhoneAlt, faPlus, faPlusSquare, faRupeeSign, faSquare, faTimes, faUser, faUserPlus, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { ModalsService } from '../modals.service';
import pdfMake from "pdfmake/build/pdfmake";
import { MatSnackBar } from '@angular/material/snack-bar';
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-create-invoice-modal',
  templateUrl: './create-invoice-modal.component.html',
  styleUrls: ['./create-invoice-modal.component.css']
})
export class CreateInvoiceModalComponent implements OnInit {
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
      name: null,
      mobileNumber: null,
      address: null,
      id: null
    }
  };
  customers = [];

  itemsData = [];

  suggestions = [];

  itemSuggestions = [];

  instantPayment: boolean = true;

  invoicePreviewData: any;

  constructor(
    private formBuilder: FormBuilder,
    private modalsService: ModalsService,
  ) { }

  ngOnInit(): void {
    this.customers = this.modalsService.customers;
    this.suggestions = this.customers.slice(0, 2);
    this.itemsData = this.modalsService.itemsData;
    this.itemSuggestions = this.itemsData.slice(0,5);
    this.today = new Date;
    this.buildForms();
    this.invoiceDetail.customer = {
      name: null,
      mobileNumber: null,
      address: null,
      id: null
    };

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
  }

  buildForms(){
    this.invoiceForm = this.formBuilder.group({
      customerMobileNumberInput: [''],
      invoiceNumber: ['45', Validators.required],
      invoiceDate: [ this.today.toLocaleDateString(), Validators.required],
      items: this.formBuilder.array([]),
      paymentReceived: ['', Validators.required],
      roundOff: []
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
      name: null,
      mobileNumber: null,
      address: null,
      id: null
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
      stockQuantity: [this.itemSuggestions[index].stockQuantity],
      quantity: [1]
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
          text: 'Customer Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: 'Name : Sanskar Soni',
                bold:true
              },
              { text: 'Mobile : 8823078781' },
              { text: 'Address : Bamhori' },

            ],
            [
              {
                text: 'Invoice Date : 09/17/2021',
                alignment: 'right'
              },
              {
                text: `Invoice Number : 8785`,
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
            body: [
              [ { text: 'S.No.', bold: true }, { text: 'Item Name', bold: true }, { text: 'Quantity', bold: true }, { text: 'MRP', bold: true }, { text: 'Rate', bold: true }, { text: 'Amount', bold: true } ],
              ['1', 'item1', 8, '₹ 855', '₹ 852', '₹ 895' ],
              ['2', 'item1', 8, 888, 852, 895 ],
              ['3', 'item1', 8, 888, 852, 895 ],
              ['4', 'item1', 8, 888, 852, 895 ],
              ['5', 'item1', 8, 888, 852, 895 ],

            ]
          }
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto','*'],
            body: [
              [ { text: 'Grand Total', bold: true }, '₹ 888'],
              [ { text: 'Discount', bold: true }, '₹ 87'],
              [ { text: 'Net Amount', bold: true }, '₹ 888'],
              [ { text: 'Paid', bold: true }, '₹ 888'],


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

    this.invoiceForm.reset();
    this.items.clear();
    this.invoiceDetail.customer = {
      name: null,
      mobileNumber: null,
      address: null,
      id: null
    }

  };

  //.......

  onGoToSecondModal(){
    this.invoicePreviewData = this.invoiceForm.value;
    if(this.instantPayment === true){
      this.paymentReceived = this.invoiceTotalAmountByTotalItems;
    }
    else if(this.instantPayment === false){
      this.paymentReceived = 0;
    }

  };

}



