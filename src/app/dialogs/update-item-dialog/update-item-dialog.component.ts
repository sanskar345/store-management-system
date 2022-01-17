import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { UiService } from 'src/app/core/services/ui.service';

@Component({
  selector: 'app-update-item-dialog',
  templateUrl: './update-item-dialog.component.html',
  styleUrls: ['./update-item-dialog.component.css']
})
export class UpdateItemDialogComponent implements OnInit {

  updateForm: FormGroup;
  passedData: {
    item: any
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogtRef: MatDialogRef<UpdateItemDialogComponent>,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private uiService: UiService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.passedData = this.data;
    this.buildForms();
  }

  buildForms(){
    this.updateForm = this.formBuilder.group({
      rate: [this.passedData.item.rate, Validators.required],
      mrp: [this.passedData.item.mrp, Validators.required],
      purchasePrice: [this.passedData.item.purchasePrice, Validators.required],
      quantity: [this.passedData.item.quantity, Validators.required]
    })
  }

  close(){
    this.dialogtRef.close('closed');
  }

  onUpdate(){
    if(this.updateForm.valid){
      this.updateItemById();
    }
  }

  updateItemById(){
    this.spinner.show('mainSpinner');
    let profit = this.updateForm.get('rate').value - this.updateForm.get('purchasePrice').value;
    let data = {
      rate: this.updateForm.get('rate').value,
      mrp: this.updateForm.get('mrp').value,
      purchasePrice: this.updateForm.get('purchasePrice').value,
      quantity: this.updateForm.get('quantity').value,
      profit: profit
    }

    if(data.rate > data.mrp){
      this.uiService.openSnackBar('Rate must be less than or equal to Mrp', 'Close');
      this.spinner.hide('mainSpinner');
      return;
    }
    if(data.purchasePrice > data.mrp || data.purchasePrice > data.rate){
      this.uiService.openSnackBar('Purchase Price must be less than or equal to Mrp and Rate', 'Close');
      this.spinner.hide('mainSpinner');
      return;
    }

    this.apiService.updateItemById(this.passedData.item._id, data)
      .subscribe((response) => {
        if(response){
          this.spinner.hide('mainSpinner');
          this.close();
          this.uiService.openSnackBar('Item Updated Successfully', 'Close');
        }

      }, error => {
        this.spinner.hide('mainSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');
      })
  }

}
