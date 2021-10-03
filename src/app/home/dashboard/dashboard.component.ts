import { Component, OnInit } from '@angular/core';
import { faHome, faUser, faSquare, faEllipsisV, faFileInvoice, faMoneyBillWave, faMoneyBill, faHandHolding, faMoneyBillWaveAlt, faRupeeSign } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  faHome = faHome;
  faUser = faUser;
  faSquare = faSquare;
  faEllipsisV = faEllipsisV;
  faFileInvoice = faFileInvoice;
  faMoneyBillWave = faMoneyBillWave;
  faMoneyBill = faMoneyBill;
  faMoneyBillWaveAlt = faMoneyBillWaveAlt;
  faRupeeSign = faRupeeSign;

  number = [12, 3]

  constructor() { }

  ngOnInit(): void {
  }

}
