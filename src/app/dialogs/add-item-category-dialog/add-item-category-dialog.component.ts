import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { UiService } from 'src/app/core/services/ui.service';

@Component({
  selector: 'app-add-item-category-dialog',
  templateUrl: './add-item-category-dialog.component.html',
  styleUrls: ['./add-item-category-dialog.component.css']
})
export class AddItemCategoryDialogComponent implements OnInit {

  itemCategoryForm: FormGroup;
  passedData: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogtRef: MatDialogRef<AddItemCategoryDialogComponent>,
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
    this.itemCategoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    })
  }

  onAddCategory(){
    this.spinner.show('mainSpinner');
    this.apiService.addItemCategory({ name:this.itemCategoryForm.get('name').value })
      .subscribe((response) => {
        this.spinner.hide('mainSpinner');
        if(response){
          this.uiService.openSnackBar('Item Category added successfully.', 'Close');
        }
      }, (error) => {
        this.spinner.hide('mainSpinner');
        if(((error.error.message).toString()).includes('Duplicate')){
          this.uiService.openSnackBar('Item Category Already Exists', 'Close');
        }else{
          this.uiService.openSnackBar(error.error.message, 'Close');
          this.itemCategoryForm.reset();
        }
      });

    this.close();
  }

  close(){
    this.dialogtRef.close('add');
  }

  get formControls(){
    return this.itemCategoryForm.controls;
  }
}
