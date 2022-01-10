import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EMAIL_REGEX } from '../core/constants/regex.constant';
import { ApiService } from '../core/services/api.service';
import { FormService } from '../core/services/form.service';
import { StorageService } from '../core/services/storage.service';
import { UiService } from '../core/services/ui.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: [
    './auth.component.css']
})
export class AuthComponent implements OnInit {

  showRegister = false;
  authenticationForm: FormGroup;
  signUpForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private formService: FormService,
    private apiService: ApiService,
    private uiService: UiService,
    private storageService: StorageService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.buildForms();
    if( window.screen.availWidth < 1250 || window.screen.availHeight < 700){
      alert("This Web App is made for Desktop Size Screens!\n Please Use Bigger Screen.");
     }
  }

  switchMode(){
    this.showRegister = !this.showRegister;
  };

  buildForms(){
    this.authenticationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
      password: ['', Validators.required]
    });

    this.signUpForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.formService.MustMatch('password', 'confirmPassword')
    });
  };

  verifyLogin(){
    this.spinner.show('loginSpinner');
    this.apiService.loginUser({
        "email": this.authenticationForm.get('email').value,
        "password": this.authenticationForm.get('password').value
    }).subscribe((response: {[key: string]: any}) => {
      console.log(response);
      this.spinner.hide('loginSpinner');
      if(response.status === 'success'){
        this.router.navigate(['/home']);
        this.storageService.setString('token', response.token);
        this.storageService.setString('user', JSON.stringify(response.data));
        this.authenticationForm.reset();
        this.uiService.openSnackBar('Login Successful', 'Close');
      }
    }, (error) => {
      this.spinner.hide('loginSpinner');
      console.log(error);
      this.uiService.openSnackBar(error.error.message, 'Close');
      this.authenticationForm.reset();
    })
  }

  onSignUp(){
    this.spinner.show('signUpSpinner');
    this.apiService.signUpUser({
      name: this.signUpForm.get('name').value,
      email: this.signUpForm.get('email').value,
      password: this.signUpForm.get('password').value,
      confirmPassword: this.signUpForm.get('confirmPassword').value
    }).subscribe((response) => {
      this.spinner.hide('signUpSpinner');
      console.log(response);
      this.uiService.openSnackBar('Sign Up Successful', 'Close');
      this.signUpForm.reset();
      this.switchMode();
    }, (error) => {
      this.spinner.hide('signUpSpinner');
      console.log(error);
      if(((error.error.message).toString()).includes('Duplicate')){
        this.uiService.openSnackBar('User Already Exists', 'Close');
        this.signUpForm.reset();
        this.switchMode();
      }else{
        this.uiService.openSnackBar(error.error.message, 'Close');
        this.signUpForm.reset();
      }
    });
  }

}
