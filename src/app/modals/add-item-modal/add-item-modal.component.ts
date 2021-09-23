import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-item-modal',
  templateUrl: './add-item-modal.component.html',
  styleUrls: ['./add-item-modal.component.css']
})
export class AddItemModalComponent implements OnInit {

  showAddExpiryAndManufacturingDetail: boolean = false;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  onAddItem(){

  }

  makeShowAddExpiryAndManufacturingDetailTrue(){
    this.showAddExpiryAndManufacturingDetail = true;
  }

  makeShowAddExpiryAndManufacturingDetailFalse(){
    this.showAddExpiryAndManufacturingDetail = false;
  }

}
