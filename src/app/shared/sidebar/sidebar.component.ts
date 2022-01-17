import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { UiService } from 'src/app/core/services/ui.service';
import { ChangePictureDialogComponent } from 'src/app/dialogs/change-picture-dialog/change-picture-dialog.component';
import { CreateInvoiceDialogComponent } from 'src/app/dialogs/create-invoice-dialog/create-invoice-dialog.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  storeName: string;

  constructor(
    private dialog: MatDialog,
    private uiService: UiService,
    private apiService: ApiService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {

    this.getStore();
  }

  openAddItemCategoryDialog() {
    // const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;

    // let dialog = this.dialog.open(ChangePictureDialogComponent, {
    //   data : {
    //   }
    // });
  }

  getStore(){
    this.spinner.show('mainSpinner');
    this.apiService.getStore()
      .subscribe((response: any) => {
        this.spinner.hide('mainSpinner');
        if(response){
          const store = response.data[0];
          this.storeName = store.name;
        }
      }, error => {
        this.spinner.hide('mainSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');
      })
  }

  // open crete invoice dialog

  openCreateInvoiceDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(CreateInvoiceDialogComponent, {
      width: '100vw',
      data : {
        showModal1: true,
        showModal2: false
      }
    });

    // const dialogRef = this.dialog.open(AlertDialogComponent);

    dialog.afterClosed().subscribe(
      (d) => {}
    );


  }

}
