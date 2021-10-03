import { Component, OnInit } from '@angular/core';
import { faDotCircle, faEllipsisV, faPlus, faRupeeSign, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/dialogs/alert-dialog/alert-dialog.component';

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
  faTrashAlt = faTrashAlt

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

  openDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(AlertDialogComponent, {
      data : {
        title: 'Delete Customer?',
        subtitle: 'Do you really want to delete this Customer',
        showDangerBtn: true,
        showPrimaryBtn: true,
        dangerBtnName: 'Cancel',
        primaryBtnName: 'Delete'
      }
    });

    // const dialogRef = this.dialog.open(AlertDialogComponent);

    dialog.afterClosed().subscribe(
        data => console.log("Dialog output:", data)
    );


  }



}
