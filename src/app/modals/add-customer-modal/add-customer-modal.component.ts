import { Component, OnInit } from '@angular/core';
import { ModalsService } from '../modals.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-add-customer-modal',
  templateUrl: './add-customer-modal.component.html',
  styleUrls: ['./add-customer-modal.component.css']
})
export class AddCustomerModalComponent implements OnInit {

  

  constructor(
    private snackBar: MatSnackBar,
    private modalsService: ModalsService
  ) { }

  ngOnInit(): void {
  }

  onAddCustomer(){
    this.openSnackBar('Customer Added Successfully', 'Close')
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

}
