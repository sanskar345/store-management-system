import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { UiService } from 'src/app/core/services/ui.service';
import { ModalsService } from '../modals.service';

@Component({
  selector: 'app-add-item-modal',
  templateUrl: './add-item-modal.component.html',
  styleUrls: ['./add-item-modal.component.css']
})
export class AddItemModalComponent implements OnInit {

  @ViewChild('addItemModal') addItemModal: any

  showAddExpiryAndManufacturingDetail: boolean = false;
  addItemForm: FormGroup;

  mdlSampleIsOpen = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private uiService: UiService,
    private modalService: ModalsService,
    ) { }

  categories = this.modalService.itemCategories;

  ngOnInit(): void {
    this.buildForms();
    this.uiService.addItemSubject.subscribe((res) => {
      if(res){
        this.mdlSampleIsOpen = true;
      }else{

      }
    })
  }


  onAddItem(){
    this.apiService.addItem({
      "name": this.addItemForm.get('name').value,
      "rate": this.addItemForm.get('rate').value,
      "mrp": this.addItemForm.get('mrp').value,
      "category": this.addItemForm.get('category').value,
      "size": this.addItemForm.get('size').value,
      "quantity": this.addItemForm.get('quantity').value,
      "expiryDate": this.addItemForm.get('expiryDate').value,
      "manufacturingDate": this.addItemForm.get('manufacturingDate').value,
      "purchasePrice": this.addItemForm.get('purchasePrice').value,
      "brand": this.addItemForm.get('brand').value

    }).subscribe((response) => {
      if(response){
        this.uiService.openSnackBar('Item added successfully', 'Close');
      }
    }, (error) => {
      if(((error.error.message).toString()).includes('Duplicate')){
        this.uiService.openSnackBar('Item Already Exists', 'Close');
      }else{
        this.uiService.openSnackBar(error.error.message, 'Close');
        this.addItemForm.reset();
      }
    });
  }

  makeShowAddExpiryAndManufacturingDetailTrue(){
    this.showAddExpiryAndManufacturingDetail = true;
  }

  makeShowAddExpiryAndManufacturingDetailFalse(){
    this.showAddExpiryAndManufacturingDetail = false;
  }

  buildForms(){
    this.addItemForm = this.formBuilder.group({
      name: ['', Validators.required],
      mrp: ['', Validators.required],
      rate: ['', Validators.required],
      category: ['', Validators.required],
      size: ['', Validators.required],
      quantity: ['', Validators.required],
      expiryDate: [''],
      manufacturerDate: [''],
      purchasePrice: ['', Validators.required],
      brand: ['', Validators.required],
    })
  }

  onCategoryClick(){
    this.getItemCategories();
  }

  getItemCategories(){
    this.apiService.getItemCategory()
      .subscribe((response: {[key: string]: any}) => {
        if(response){
          console.log('itemCategory', response);

          this.categories = response.data;
        }
      }, (error) => {
        this.uiService.openSnackBar(error.error.message, 'Close')
      });
  }

}
