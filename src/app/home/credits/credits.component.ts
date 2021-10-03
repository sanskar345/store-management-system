import { Component, OnInit } from '@angular/core';
import { faRupeeSign } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.css']
})
export class CreditsComponent implements OnInit {

  faRupeeSign = faRupeeSign;

  number = [1,3,2,2,3,2,32,3,3,2]

  constructor() { }

  ngOnInit(): void {
  }

}
