import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {  faFilter } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { UiService } from 'src/app/core/services/ui.service';
import { UpdateItemDialogComponent } from 'src/app/dialogs/update-item-dialog/update-item-dialog.component';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  faFilter = faFilter;

  items = [];

  filterArray = [{name: 'Quantity less than 10', value: 1},{name: 'Quantity less than 20', value: 2},{name: 'Quantity less than 40', value: 3}]

  constructor(
    private apiService: ApiService,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getItems({'quantity[lt]': 10});
  }

   // get items

   getItems(params: {}){
    this.spinner.show('mainSpinner');
    this.apiService.getItemsByParams(params).subscribe((response: any) => {
      this.spinner.hide('mainSpinner');
      console.log('items', response);
      this.items = response.data;
    }, error => {
      this.spinner.hide('mainSpinner');
      console.log(error);
      this.uiService.openSnackBar(error.error.message, 'Close');
    })
  }

  onFilter(event){
    console.log(event);

    if(event == 1){
      this.getItems({'quantity[lt]': 10});
    }
    else if(event == 2){
      this.getItems({'quantity[lt]': 20});
    }
    else if(event == 3){
      this.getItems({'quantity[lt]': 40});
    }

  }

  openUpdateItemDialog(item) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(UpdateItemDialogComponent, {
      width: '40vw',
      data : {
        item
      }
    });

    // const dialogRef = this.dialog.open(AlertDialogComponent);

    dialog.afterClosed().subscribe(
        data => {
          if(data){
            this.getItems({'quantity[lt]': 10});
          }
        }
    );




  }

}
