import { Component, OnInit } from '@angular/core';
import { ModalsService } from '../modals.service';
import { faBraille, faCalendarAlt, faHashtag, faInfo, faMapMarkerAlt, faPhoneAlt, faPlus, faPlusSquare, faRupeeSign, faSquare, faTimes, faUser, faUserPlus, faUserTie } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-receive-customer-credit-modal',
  templateUrl: './receive-customer-credit-modal.component.html',
  styleUrls: ['./receive-customer-credit-modal.component.css']
})
export class ReceiveCustomerCreditModalComponent implements OnInit {
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

  constructor(
    private modalsService: ModalsService
  ) { }


  ngOnInit(): void {
    this.customers = this.modalsService.customers;
    this.suggestions = this.customers.slice(0, 2);
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




}
