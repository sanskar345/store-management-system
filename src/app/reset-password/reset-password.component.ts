import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EMAIL_REGEX } from '../core/constants/regex.constant';
import { ApiService } from '../core/services/api.service';
import { UiService } from '../core/services/ui.service';
import { StorageService } from '../core/services/storage.service';
import { FormService } from '../core/services/form.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  showPasswordForRegister = false;
  token: string;

  constructor(
    private apiService: ApiService,
    private formbuilder: FormBuilder,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private storageService: StorageService,
    private formService: FormService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.buildForms();
    this.token = this.route.snapshot.params['requestApi'];
  }

  buildForms(){
    this.resetForm = this.formbuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.formService.MustMatch('password', 'confirmPassword')
    });
  }

  get formResetControls(){
    return this.resetForm.controls;
  }

  toggleShowPasswordForRegister(){
    this.showPasswordForRegister = !this.showPasswordForRegister;
  }

  onResetPassword(){
    this.onHitApi(this.token, {password: this.resetForm.get('password').value, confirmPassword: this.resetForm.get('confirmPassword').value});

  }

  onHitApi(token: string, data: {}){
    this.spinner.show('authSpinner');
    this.apiService.resetPassword(token, data)
      .subscribe((response: any) => {
        this.spinner.hide('authSpinner');
        if(response.status === 'success'){
          this.uiService.openSnackBar('Password Reset Successful, login now', 'Close');
          this.storageService.removeString('resetPassword');
          this.router.navigate(['']);
        }
      }, error => {
        this.spinner.hide('authSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');
        this.resetForm.reset();
      });
  }

}
