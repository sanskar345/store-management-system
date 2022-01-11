import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MOBILE_REGEX } from 'src/app/core/constants/regex.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { UiService } from 'src/app/core/services/ui.service';

@Component({
  selector: 'app-add-customer-dialog',
  templateUrl: './add-customer-dialog.component.html',
  styleUrls: ['./add-customer-dialog.component.css']
})
export class AddCustomerDialogComponent implements OnInit {

  addCustomerForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogtRef: MatDialogRef<AddCustomerDialogComponent>,
    private formBuilder: FormBuilder,
    private uiService: UiService,
    private apiService: ApiService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.buildForms();
  }

  onAddCustomer(){
    this.spinner.show('mainSpinner');
    if(this.addCustomerForm.valid){
      this.apiService.addCustomer({
        name: (this.addCustomerForm.get('customerName').value).toLowerCase(),
        mobileNumber: this.addCustomerForm.get('mobile').value,
        address: this.addCustomerForm.get('address').value,
        dob: this.addCustomerForm.get('dob').value,
        credit: 0
      }).subscribe((response) => {
        this.spinner.hide('mainSpinner');
        console.log(response);
        if(response){
          this.uiService.openSnackBar('Customer added successfully.', 'Close');
          this.close();
        }

      }, (error) => {
        this.spinner.hide('mainSpinner');
        // this.uiService.openSnackBar(error.error.message, 'Close');
        if(((error.error.message).toString()).includes('Duplicate')){
          this.uiService.openSnackBar('Customer Already Exists', 'Close');
        }else{
          this.uiService.openSnackBar(error.error.message, 'Close');
          this.addCustomerForm.reset();
        }
      })
    }
  }


  buildForms(){
    this.addCustomerForm = this.formBuilder.group({
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required, Validators.minLength(4)]],
      mobile: ['', [Validators.required, Validators.pattern(MOBILE_REGEX)]],
      dob: ['', Validators.required]
    });
  }

  close(){
    this.dialogtRef.close('add');
  }

  get customerControls(){
    return this.addCustomerForm.controls;
  }

}
