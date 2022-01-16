import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EMAIL_REGEX } from '../core/constants/regex.constant';
import { ApiService } from '../core/services/api.service';
import { UiService } from '../core/services/ui.service';
import { StorageService } from '../core/services/storage.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private formbuilder: FormBuilder,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.buildForms();
  }

  buildForms(){
    this.forgotForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]]
    });
  }

  get formControls(){
    return this.forgotForm.controls;
  }

  onForgotPassword(){
    this.onHitApi({email: this.forgotForm.get('email').value});
  }

  onHitApi(data: {}){
    this.spinner.show('authSpinner');
    this.apiService.forgotPassword(data)
      .subscribe((response: any) => {
        this.spinner.hide('authSpinner');
        if(response.status === 'success'){
          this.storageService.setString('resetPassword', '1');
          this.router.navigate(['']);
          this.uiService.openSnackBar('Check your email to reset password.', 'Close');
          this.forgotForm.reset();
        }
      }, error => {
        this.spinner.hide('authSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');
        this.forgotForm.reset();
      });
  }

  onCancel(){
    this.router.navigate(['']);
  }

}
