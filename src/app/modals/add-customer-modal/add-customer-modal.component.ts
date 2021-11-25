import { Component, OnInit } from '@angular/core';
import { ModalsService } from '../modals.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MOBILE_REGEX } from 'src/app/core/constants/regex.constant';
import { UiService } from 'src/app/core/services/ui.service';
import { ApiService } from 'src/app/core/services/api.service';



@Component({
  selector: 'app-add-customer-modal',
  templateUrl: './add-customer-modal.component.html',
  styleUrls: ['./add-customer-modal.component.css']
})
export class AddCustomerModalComponent implements OnInit {

  addCustomerForm: FormGroup;

  constructor(
    private modalsService: ModalsService,
    private formBuilder: FormBuilder,
    private uiService: UiService,
    private apiService: ApiService
  ) { }

  ngOnInit(


  ): void {
    this.buildForms();
  }

  onAddCustomer(){
    if(this.addCustomerForm.valid){
      this.apiService.addCustomer({
        name: this.addCustomerForm.get('customerName').value,
        mobileNumber: this.addCustomerForm.get('mobile').value,
        address: this.addCustomerForm.get('address').value,
        dob: this.addCustomerForm.get('dob').value,
        credit: 0
      }).subscribe((response) => {
        console.log(response);
        if(response){
          this.uiService.openSnackBar('Customer added successfully.', 'Close');
        }

      }, (error) => {
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


}
