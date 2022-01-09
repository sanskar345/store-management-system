import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faDotCircle, faEdit, faEllipsisV, faInfo, faPlus, faRupeeSign, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { HomeHeaderComponent } from '../home-header/home-header.component';
import { PageEvent } from '@angular/material/paginator';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { UiService } from 'src/app/core/services/ui.service';
import { AddItemDialogComponent } from 'src/app/dialogs/add-item-dialog/add-item-dialog.component';
import { AlertDialogComponent } from 'src/app/dialogs/alert-dialog/alert-dialog.component';
import { UpdateItemDialogComponent } from 'src/app/dialogs/update-item-dialog/update-item-dialog.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  @ViewChild('input1', {static: true}) input1: ElementRef;

  pageEvent: PageEvent;
  paginationLength: number = 100;

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

  item: {
    adminIdFk: null,
    brand: null,
    category: null,
    createdAt: null,
    id: null,
    mrp: null,
    name: null,
    profit: null,
    purchasePrice: null,
    quantity: number,
    rate: number,
    size: null,
    __v: null,
    _id: null,
  };
  items = [];
  itemsBySearch = [];

  constructor(
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    private uiService: UiService
  ) { }

  ngOnInit(): void {
    this.onStart();
    this.subscribeToInput1();
  }

  onStart(){
    this.getItems({page: 1, limit: 5}, 'itemsBySearch');
    this.getItems({page: 1, limit: 2}, 'items');
    this.getItems({page: 1, limit: 1}, 'item');
    this.getItemStats();
  }

  onClickSearchBtn() {
    this.showSearchInput = true;
  }

  searchInput(e){
    this.showSearchInput = false;
    this.input1.nativeElement.value = '';
    this.getItems({page: 1, limit: 5}, 'itemsBySearch');

  }

  closeSearchInput() {
    this.showSearchInput = false;
    this.input1.nativeElement.value = '';
    this.getItems({page: 1, limit: 5}, 'itemsBySearch');

  }

  subscribeToInput1(){
    // server-side search
    fromEvent(this.input1.nativeElement,'keyup')
        .pipe(
            filter(Boolean),
            debounceTime(1100),
            distinctUntilChanged(),
            tap((event:KeyboardEvent) => {
              // console.log(event)
              console.log(this.input1.nativeElement.value)
              if(this.input1.nativeElement.value.length > 3){
                this.getItemsBySearch({name: (this.input1.nativeElement.value).toLowerCase()})
              }
            })
        )
        .subscribe();
  }

  // get items

  getItems(params: {}, f: string){
    this.spinner.show('mainSpinner');
    this.apiService.getItemsByParams(params).subscribe((response: any) => {
      this.spinner.hide('mainSpinner');
      console.log('items', response);
      if(f === 'itemsBySearch'){
        this.itemsBySearch = response.data;
      }
      else if(f === 'item'){
        const i = response.data;
        this.item = i[0];
      }else{
        this.items = response.data;
      }
    }, error => {
      this.spinner.hide('mainSpinner');
      console.log(error);
      this.uiService.openSnackBar(error.error.message, 'Close');
    })
  }

  getItemsBySearch(params: {},){
    this.spinner.show('searchSpinner');
    this.apiService.getItemsByParams(params).subscribe((response: any) => {
      this.spinner.hide('searchSpinner');
      console.log(params);

      console.log('items', response);

      this.itemsBySearch = response.data;


    }, error => {
      this.spinner.hide('searchSpinner');
      console.log(error);
      this.uiService.openSnackBar(error.error.message, 'Close');
    })
  }

  getItemStats(){
    this.spinner.hide('mainSpinner');
    this.apiService.getItemsStats()
      .subscribe((response: any) => {
        this.spinner.hide('mainSpinner');
        if(response) {
          this.paginationLength = response.data.stats[0].totalItems;
        }
      }, error => {
        this.spinner.hide('mainSpinner');
        console.log(error);
        this.uiService.openSnackBar(error.error.message, 'Close');
      })
  }

  onPaginate(event): any{
    this.getItems({'page': event.pageIndex + 1, 'limit': event.pageSize}, 'items');
  }

  onSelect(item){
    this.item = item;
  }

  //open Add item dialog

  openAddItemDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(AddItemDialogComponent, {
      width: '40vw',
      data : {
        showModal1: true,
        showModal2: false
      }
    });

    // const dialogRef = this.dialog.open(AlertDialogComponent);

    dialog.afterClosed().subscribe(
        () => this.onStart()
    );


  }

  openDeleteItemDialog() {
    if(this.item.name !== null){

      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      let dialog = this.dialog.open(AlertDialogComponent, {
        data : {
          title: 'Delete Item?',
          subtitle: `Do you really want to delete ${this.item.name}` ,
          showDangerBtn: true,
          showPrimaryBtn: true,
          dangerBtnName: 'Cancel',
          primaryBtnName: 'Delete'
        }
      });

      // const dialogRef = this.dialog.open(AlertDialogComponent);

      dialog.afterClosed().subscribe(
          data => {
            if(data){
              this.deleteItemById(this.item._id);
            }
          }
      );
    }




  }

  openUpdateItemDialog() {
    if(this.item.name !== null){

      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      let dialog = this.dialog.open(UpdateItemDialogComponent, {
        width: '40vw',
        data : {
          item: this.item
        }
      });

      // const dialogRef = this.dialog.open(AlertDialogComponent);

      dialog.afterClosed().subscribe(
          data => {
            if(data){
              this.onStart();
            }
          }
      );
    }




  }

  deleteItemById(id: string){
    this.spinner.show('mainSpinner');
    this.apiService.deleteItemById(id)
      .subscribe((response) => {
        this.spinner.hide('mainSpinner');
        this.onStart();
      }, error => {
        this.spinner.hide('mainSpinner');
        console.log(error);
        this.uiService.openSnackBar(error.error.message, 'Close');
      });
  }


}
