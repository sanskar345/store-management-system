import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { UiService } from 'src/app/core/services/ui.service';

@Component({
  selector: 'app-add-item-category-modal',
  templateUrl: './add-item-category-modal.component.html',
  styleUrls: ['./add-item-category-modal.component.css']
})
export class AddItemCategoryModalComponent implements OnInit {

  itemCategoryForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private uiService: UiService
  ) { }

  ngOnInit(): void {
    this.buildForms();
  }

  buildForms(){
    this.itemCategoryForm = this.formBuilder.group({
      name: ['', Validators.required]
    })
  }

  onAddCategory(){
    this.apiService.addItemCategory({ name:this.itemCategoryForm.get('name').value })
      .subscribe((response) => {
        if(response){
          this.uiService.openSnackBar('Item Category added successfully.', 'Close');
        }
      }, (error) => {
        if(((error.error.message).toString()).includes('Duplicate')){
          this.uiService.openSnackBar('Customer Already Exists', 'Close');
        }else{
          this.uiService.openSnackBar(error.error.message, 'Close');
          this.itemCategoryForm.reset();
        }
      });
  }

}
