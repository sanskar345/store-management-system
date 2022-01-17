import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { ONLY_NUMBERS } from 'src/app/core/constants/regex.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { UiService } from 'src/app/core/services/ui.service';
import { AddItemCategoryDialogComponent } from '../add-item-category-dialog/add-item-category-dialog.component';
import { DialogsService } from '../dialogs.service';

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrls: ['./add-item-dialog.component.css']
})
export class AddItemDialogComponent implements OnInit {

  faPlus = faPlus;

  passedData: any = {
    showModal1: false,
    showModal2: false,
  }
  addItemForm1: FormGroup;
  addItemForm2: FormGroup;
  itemCategories = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogtRef: MatDialogRef<AddItemDialogComponent>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private uiService: UiService,
    private apiService: ApiService,
    private dialogsService: DialogsService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {

    this.passedData = this.data;
    this.buildForms();
    this.getItemCategories();
  }

  close(){
    this.dialogtRef.close('add');
  }

  getItemCategories(){
    this.spinner.show('mainSpinner');
    this.apiService.getItemCategory()
      .subscribe((response: {[key: string]: any}) => {
        this.spinner.hide('mainSpinner');
        if(response){

          this.itemCategories = response.data;
        }
      }, (error) => {
        this.spinner.hide('mainSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close')
      });
  }

  buildForms(){
    this.addItemForm1 = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      mrp: ['', [Validators.required, Validators.pattern(ONLY_NUMBERS)]],
      rate: ['', [Validators.required, Validators.pattern(ONLY_NUMBERS)]],
      purchasePrice: ['', [Validators.required, Validators.pattern(ONLY_NUMBERS)]],
      brand: ['', [Validators.required, Validators.minLength(3)]]
    })
    this.addItemForm2 = this.formBuilder.group({
      category: ['', Validators.required],
      size: ['', Validators.required],
      quantity: ['', Validators.required],
      expiryDate: [''],
      manufacturerDate: ['']
    })
  }

  openSecondDialog() {

    this.close();

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(AddItemDialogComponent, {
      width: '40vw',
      data : {
        showModal1: false,
        showModal2: true,
        form1Data: {
          "name": (this.addItemForm1.get('name').value).toLowerCase(),
          "rate": this.addItemForm1.get('rate').value,
          "mrp": this.addItemForm1.get('mrp').value,
          "purchasePrice": this.addItemForm1.get('purchasePrice').value,
          "brand": this.addItemForm1.get('brand').value
        }
      }
    });

    // const dialogRef = this.dialog.open(AlertDialogComponent);

    dialog.afterClosed().subscribe(
        data => {}
    );


  }

  onAddItem(){
    this.spinner.show('mainSpinner');
    let data = {
      "category": this.addItemForm2.get('category').value,
      "size": this.addItemForm2.get('size').value,
      "quantity": this.addItemForm2.get('quantity').value,
    }

    Object.assign(data, this.passedData?.form1Data);


    if(this.addItemForm2.get('expiryDate').value !== '' || this.addItemForm2.get('expiryDate').value !== null){
      Object.assign(data, {"expiryDate": this.addItemForm2.get('expiryDate').value});
    }
    if(this.addItemForm2.get('manufacturerDate').value !== '' || this.addItemForm2.get('manufacturerDate').value !== null){
      Object.assign(data, {"manufacturerDate": this.addItemForm2.get('manufacturerDate').value});
    }
    if((this.addItemForm2.get('expiryDate').value !== '' || this.addItemForm2.get('expiryDate').value !== null) && (this.addItemForm2.get('manufacturerDate').value !== '' || this.addItemForm2.get('manufacturerDate').value !== null)){
      if(this.addItemForm2.get('expiryDate').value < this.addItemForm2.get('manufacturerDate').value){
        this.spinner.hide('mainSpinner');
        return this.uiService.openSnackBar('Expiry must be greater than manufacturer', 'Close');
      }
    }


    this.apiService.addItem(data).subscribe((response) => {
      this.spinner.hide('mainSpinner');
      if(response){
        this.uiService.openSnackBar('Item added successfully', 'Close');
      }
    }, (error) => {
      this.spinner.hide('mainSpinner');
      if(((error.error.message).toString()).includes('Duplicate')){
        this.uiService.openSnackBar('Item Already Exists', 'Close');
      }else{
        this.uiService.openSnackBar(error.error.message, 'Close');
        this.addItemForm1.reset();
        this.addItemForm2.reset();
      }
    });

    this.close();
  }

  get formControls1(){
    return this.addItemForm1.controls;
  }

  openAddItemCategoryDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialog = this.dialog.open(AddItemCategoryDialogComponent, {
      width: '40vw',
      data : {
      }
    });
  }


}
