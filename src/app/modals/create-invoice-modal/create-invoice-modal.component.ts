import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { faBraille, faCalendarAlt, faHashtag, faInfo, faMapMarkerAlt, faPhoneAlt, faPlus, faPlusSquare, faRupeeSign, faSquare, faTimes, faUser, faUserPlus, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { ModalsService } from '../modals.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    },
    items: [],
  };
  customers = [
    {
      name: 'sanskar',
      address: 'bamhori',
      mobileNumber: '85858585852',
      id: '789'
    },
    {
      name: 'trilok',
      address: 'indore',
      mobileNumber: '8823078781',
      id: '456'
    },
    {
      name: 'trilok',
      address: 'indore',
      mobileNumber: '78787878789',
      id: '456'
    },
    {
      name: 'trilok',
      address: 'indore',
      mobileNumber: '78787878789',
      id: '456'
    },
    {
      name: 'trilok singh tikambar khan rajput',
      address: 'indore',
      mobileNumber: '9696969696',
      id: '456'
    },
    {
      name: 'trilok singh tikambar khan rajput',
      address: 'indore',
      mobileNumber: '9696969696',
      id: '456'
    }
  ];

  itemsData = [];

  suggestions = this.customers.slice(0, 2);

  itemSuggestions = [];


  constructor(
    private formBuilder: FormBuilder,
    private madalsService: ModalsService,
  ) { }

  ngOnInit(): void {
    this.itemsData = this.madalsService.itemsData;
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
      });
  }

  buildForms(){
    this.invoiceForm = this.formBuilder.group({
      customerMobileNumberInput: [''],
      invoiceNumber: ['45'],
      invoiceDate: [ this.today.toLocaleDateString()],
      items: this.formBuilder.array([]),
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
  };

}
