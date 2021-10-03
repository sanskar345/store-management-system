import { Component, OnInit } from '@angular/core';
import { faRupeeSign } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  faRupeeSign = faRupeeSign;

  number = [1,3,2,2,3,2,32,3,3,2]

  constructor() { }

  ngOnInit(): void {
  }

}
