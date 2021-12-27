import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { faHome, faUser, faSquare, faEllipsisV, faFileInvoice, faMoneyBillWave, faMoneyBill, faHandHolding, faMoneyBillWaveAlt, faRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { UiService } from 'src/app/core/services/ui.service';
import { AddItemCategoryDialogComponent } from 'src/app/dialogs/add-item-category-dialog/add-item-category-dialog.component';
import { AddItemDialogComponent } from 'src/app/dialogs/add-item-dialog/add-item-dialog.component';
import { DialogsService } from 'src/app/dialogs/dialogs.service';
import { ModalsModule } from 'src/app/modals/modals.module';
import { ModalsService } from 'src/app/modals/modals.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  number = [12, 3];


  constructor(
    private cdr: ChangeDetectorRef,
    private uiService: UiService,
    private apiService: ApiService,
    private dialogsService: DialogsService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    route.params.subscribe(val => {
      console.log('from route');
      // this.getItemCategories();
    });
   }

  ngOnInit(): void {

  }


  getItemCategories(){
    this.apiService.getItemCategory()
      .subscribe((response: {[key: string]: any}) => {
        if(response){
          console.log('itemCategory', response.data);

          this.dialogsService.itemCategories = response.data;
        }
      }, (error) => {
        this.uiService.openSnackBar(error.error.message, 'Close')
      });
  }

  addItem(){
    this.uiService.addItemSubject.next(true);
  }

  //open Add item dialog

  openAddItemDialog() {
    this.getItemCategories();
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(AddItemDialogComponent, {
      width: '500px',
      data : {
        showModal1: true,
        showModal2: false
      }
    });

    // const dialogRef = this.dialog.open(AlertDialogComponent);

    dialog.afterClosed().subscribe(
        data => console.log("Dialog output:", data)
    );


  }

  // open add item category dialog

  openAddItemCategoryDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(AddItemCategoryDialogComponent, {
      width: '500px',
      data : {
      }
    });

    // const dialogRef = this.dialog.open(AlertDialogComponent);

    dialog.afterClosed().subscribe(
        data => console.log("Dialog output:", data)
    );


  }

}
