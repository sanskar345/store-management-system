import { Component, OnInit } from '@angular/core';
import { faDotCircle, faEllipsisV, faPlus, faRupeeSign } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  //icons

  faPlus = faPlus
  faDotCircle = faDotCircle
  faRupeeSign = faRupeeSign
  faEllipsisV = faEllipsisV

  //end of icons

  showSearchInput = false;

  constructor() { }

  ngOnInit(): void {
  }

  onClickSearchBtn() {
    this.showSearchInput = true;
  }

  searchInput(e){
    this.showSearchInput = false;

  }

  closeSearchInput() {
    this.showSearchInput = false;
  }

}
