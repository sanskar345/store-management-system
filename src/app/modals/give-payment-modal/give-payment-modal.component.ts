import { Component, OnInit } from '@angular/core';
import { faCalendarAlt, faFileInvoice, faHashtag, faInfo, faPhoneAlt, faRupeeSign, faUserTie } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-give-payment-modal',
  templateUrl: './give-payment-modal.component.html',
  styleUrls: ['./give-payment-modal.component.css']
})
export class GivePaymentModalComponent implements OnInit {

  faRupeeSign = faRupeeSign;
  faCalendarAlt = faCalendarAlt;
  faHashtag = faHashtag;
  faUserTie = faUserTie;
  faPhoneAlt = faPhoneAlt;
  faFileInvoice = faFileInvoice;
  faInfo = faInfo;

  constructor() { }

  ngOnInit(): void {
  }

}
