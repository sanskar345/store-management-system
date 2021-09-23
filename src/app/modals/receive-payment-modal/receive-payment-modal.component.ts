import { Component, OnInit } from '@angular/core';
import { faCalendarAlt, faFileInvoice, faHashtag, faInfo, faPhoneAlt, faRupeeSign, faUserTie } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-receive-payment-modal',
  templateUrl: './receive-payment-modal.component.html',
  styleUrls: ['./receive-payment-modal.component.css']
})
export class ReceivePaymentModalComponent implements OnInit {

  faRupeeSign = faRupeeSign;
  faCalendarAlt = faCalendarAlt;
  faHashtag = faHashtag;
  faUserTie = faUserTie;
  faPhoneAlt = faPhoneAlt;
  faFileInvoice = faFileInvoice;
  faInfo = faInfo;
  today: string;
  totalAmount: number;
  constructor() { }

  ngOnInit(): void {
    this.today = (new Date()).toLocaleDateString();
  }

  onPaymentInInput(event){
    this.totalAmount = event.target.value;

  }

}
