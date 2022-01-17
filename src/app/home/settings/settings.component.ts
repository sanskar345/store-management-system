import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MOBILE_REGEX, ONLY_LETTERS } from 'src/app/core/constants/regex.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { UiService } from 'src/app/core/services/ui.service';
import { DialogsService } from 'src/app/dialogs/dialogs.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  showStoreNameChange = false;
  showStoreContactChange = false;

  store: any;
  storeName: any;
  storeContact: any;

  updateForm: FormGroup;

  constructor(
    private dialogService: DialogsService,
    private uiService: UiService,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getStore();
    this.buildForms();
  }

  toggleShowStoreNameChange() {
    this.showStoreNameChange = !this.showStoreNameChange;
  }

  toggleShowStoreContactChange(){
    this.showStoreContactChange = !this.showStoreContactChange;
  }

  onNameChange(){
    const data = {
      name: this.updateForm.get('name').value,
    }
    if(this.updateControls.name.valid){

      this.updateStoreById(this.store._id, data);
    }else{
      this.uiService.openSnackBar('Invalid name.', 'Close');
    }
  }

  onNumberChange(){
    const data = {
      storeContactNumber: this.updateForm.get('mobileNumber').value
    }
    if(this.updateControls.mobileNumber.valid){

      this.updateStoreById(this.store._id, data);
    }else{
      this.uiService.openSnackBar('Invalid mobile number.', 'Close');
    }
  }

  updateStoreById(id: string, data: {}){
    this.spinner.show('mainSpinner');
    this.apiService.updateStoreById(id, data)
      .subscribe((response) => {
        if(response){
          this.showStoreContactChange = false;
          this.showStoreNameChange = false;
          this.getStore();
          this.uiService.openSnackBar('Update Successful.', 'Close');
        }
        this.spinner.hide('mainSpinner');

      }, error => {
        this.spinner.hide('mainSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');
      });
  }

  buildForms(){
    this.updateForm = this.formBuilder.group({
      name: [this.store?.name, [Validators.required, Validators.pattern(ONLY_LETTERS), Validators.minLength(4)]],
      mobileNumber: [this.store?.storeContactNumber, [Validators.required, Validators.pattern(MOBILE_REGEX)]]
    })
  }

  getStore(){
    this.spinner.show('mainSpinner');
    this.apiService.getStore()
      .subscribe((response: any) => {
        this.spinner.hide('mainSpinner');
        if(response){

          this.store = response.data[0];
          this.storeName = this.store.name;
          this.storeContact = this.store.storeContactNumber;
        }
      }, error => {
        this.spinner.hide('mainSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');
      })
  }

  get updateControls(){
    return this.updateForm.controls;
  }

}
