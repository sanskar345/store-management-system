import { Component, OnInit } from '@angular/core';
import { faDotCircle, faEdit, faEllipsisV, faInfo, faPlus, faRupeeSign, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { HomeHeaderComponent } from '../home-header/home-header.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  //icons

  faPlus = faPlus
  faDotCircle = faDotCircle
  faRupeeSign = faRupeeSign
  faEllipsisV = faEllipsisV
  faTrashAlt = faTrashAlt
  faEdit = faEdit
  faInfo = faInfo

  //end of icons

  showSearchInput = false;

  constructor(
    private dialog: MatDialog
  ) { }

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
