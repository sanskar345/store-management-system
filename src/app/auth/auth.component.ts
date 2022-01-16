import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EMAIL_REGEX, MOBILE_REGEX, ONLY_LETTERS, ONLY_NUMBERS, OTP_REGEX } from '../core/constants/regex.constant';
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
  showRegister1 = true;
  showRegister2 = false;
  showRegister3 = false;
  authenticationForm: FormGroup;
  signUpForm1: FormGroup;
  signUpForm2: FormGroup;
  signUpForm3: FormGroup;
  showPasswordForLogin = false;
  showPasswordForRegister = false;

  resendOtpTimer: any;
  resendOtpCounter = 120;

  token: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private formService: FormService,
    private apiService: ApiService,
    private uiService: UiService,
    private storageService: StorageService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.buildForms();
    console.log(window.screen.availWidth,window.screen.availHeight );

    if( window.screen.availWidth < 1350  || window.screen.availHeight < 750){
      alert("This Web App is made for Desktop Size Screens!\n Please Use Bigger Screen.");
     }

  }

  switchMode(){
    this.showRegister = !this.showRegister;
    this.authenticationForm.reset();
    this.signUpForm1.reset();
    this.signUpForm2.reset();
    this.signUpForm3.reset();
    if(this.showRegister){
      this.showRegister1 = true;
      this.showRegister2 = false;
      this.showRegister3 = false;
    }
    this.stopResendOtpTimer();
  };

  buildForms(){
    this.authenticationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.signUpForm1 = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.pattern(ONLY_LETTERS)]],
      storeName: ['', [Validators.required, Validators.minLength(4), Validators.pattern(ONLY_LETTERS)]],
      mobileNumber: ['', [Validators.pattern(MOBILE_REGEX), Validators.required]]
    });

    this.signUpForm2 = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.formService.MustMatch('password', 'confirmPassword')
    });

    this.signUpForm3 = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.pattern(ONLY_NUMBERS), Validators.minLength(6), Validators.maxLength(6)]]
    })
  };

  verifyLogin(){
    this.spinner.show('loginSpinner');
    this.apiService.loginUser({
        "email": this.authenticationForm.get('email').value,
        "password": this.authenticationForm.get('password').value
    }).subscribe((response: {[key: string]: any}) => {
      console.log(response);

      if(response.status === 'success'){
        this.router.navigate(['/home']);
        this.storageService.setString('token', response.token);
        this.storageService.setString('user', JSON.stringify(response.data));
        this.authenticationForm.reset();
        this.uiService.openSnackBar('Login Successful', 'Close');
      }
      this.spinner.hide('loginSpinner');
    }, error => {
      this.spinner.hide('loginSpinner');
      console.log(error);
      this.uiService.openSnackBar(error.error.message, 'Close');
      this.authenticationForm.reset();
    })
  }

  onSignUp(){
    this.spinner.show('signUpSpinner');
    const storeName = this.signUpForm1.get('storeName').value;
    const mobileNumber = this.signUpForm1.get('mobileNumber').value;
    this.apiService.signUpUser({
      name: (this.signUpForm1.get('name').value),
      email: this.signUpForm2.get('email').value,
      password: this.signUpForm2.get('password').value,
      confirmPassword: this.signUpForm2.get('confirmPassword').value
    }).subscribe((response: any) => {

      console.log(response);
      this.switchMode();
      console.log(this.signUpForm1);

      let data = {
        name: storeName,
        storeContactNumber: mobileNumber,
        adminIdFk: response.data.user._id
      }
      this.apiService.createStore(data, response.token).subscribe((response) => {
        if(response){
          this.signUpForm1.reset();
          this.signUpForm2.reset();
          this.uiService.openSnackBar('Sign Up Successful', 'Close');
          this.spinner.hide('signUpSpinner');
        }
      }, error => {
        console.log(error);
        this.uiService.openSnackBar(error.error.message, 'Close');
        this.spinner.hide('signUpSpinner');
      })


    }, (error) => {
      this.spinner.hide('signUpSpinner');
      console.log(error);
      if(((error.error.message).toString()).includes('Duplicate')){
        this.uiService.openSnackBar('User Already Exists', 'Close');
        this.signUpForm1.reset();
        this.signUpForm2.reset();
        this.switchMode();
      }else{
        this.uiService.openSnackBar(error.error.message, 'Close');
        this.signUpForm1.reset();
        this.signUpForm2.reset();
      }
    });
  }

  onNext(){
    this.showRegister = true;
    this.showRegister1 = false;
    this.showRegister2 = true;
    this.showRegister3 = false;
  }

  onSendOtp(){
    this.showRegister = true;
    this.showRegister1 = false;
    this.showRegister2 = false;
    this.showRegister3 = true;
    this.startResendOtpTimer();
    this.generateOtp({email: this.signUpForm2.get('email').value, name: this.signUpForm1.get('name').value});
  }

  onVerifyOtp(){
    this.verifyOtp({token: this.token, otp: (this.signUpForm3.get('otp').value).toString(), check: this.signUpForm2.get('email').value});
  }

  get authenticationControls(){
    return this.authenticationForm.controls;
  }

  get register1Controls(){
    return this.signUpForm1.controls;
  }

  get register2Controls(){
    return this.signUpForm2.controls;
  }

  get register3Controls(){
    return this.signUpForm3.controls;
  }

  toggleShowPasswordForLogin(){
    this.showPasswordForLogin = !this.showPasswordForLogin;
  }

  toggleShowPasswordForRegister(){
    this.showPasswordForRegister = !this.showPasswordForRegister;
  }

  resetBools(){
    this.showPasswordForLogin = false;
    this.showPasswordForRegister = false;
    this.showRegister = false;
    this.showRegister1 = true;
    this.showRegister2 = false;
    this.showRegister3 = false;
    this.stopResendOtpTimer();
    this.signUpForm1.reset();
    this.signUpForm2.reset();
    this.signUpForm3.reset();
    this.authenticationForm.reset();
  }

  changeEmail(){
    this.showPasswordForLogin = false;
    this.showPasswordForRegister = false;
    this.showRegister = true;
    this.showRegister1 = true;
    this.showRegister2 = false;
    this.showRegister3 = false;
    this.signUpForm1.reset();
    this.signUpForm2.reset();
    this.signUpForm3.reset();
    this.authenticationForm.reset();
    this.stopResendOtpTimer();
  }

  startResendOtpTimer(){
    this.resendOtpCounter = 120;
    this.resendOtpTimer = setInterval(() => {

      if(this.resendOtpCounter > 0){
        this.resendOtpCounter--;
      }else{
        this.stopResendOtpTimer();
      }
    }, 1000)
  }

  stopResendOtpTimer(){
    clearInterval(this.resendOtpTimer);
  };

  onResendOTP(){
    this.stopResendOtpTimer();
    this.generateOtp({email: this.signUpForm2.get('email').value, name: this.signUpForm1.get('name').value});
    this.startResendOtpTimer();
  }

  generateOtp(data: {}){
    this.spinner.show('otpSpinner');
    this.apiService.generateOtp(data)
      .subscribe((response: any) => {
        this.spinner.hide('otpSpinner');
        if(response){
          this.token = response.details;
        }
      }, error => {
        this.spinner.hide('otpSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');
      });
  }

  verifyOtp(data: {}){
    this.spinner.show('signUpSpinner');
    this.apiService.verifyOtp(data)
      .subscribe((response: any) => {
        this.spinner.hide('signUpSpinner');
        if(response.status === 'success'){
          this.stopResendOtpTimer();
          this.onSignUp();
        }
      }, error => {
        this.spinner.hide('signUpSpinner');
        if(((error.error.message).toString()).includes('expired')){
          this.uiService.openSnackBar('OTP time expired please click on resend OTP', 'Close');
        }else{
          this.uiService.openSnackBar(error.error.message, 'Close');
        }
      });
  }

  onForgotPassword(){
    this.router.navigate(['forgot-password']);
  }
}
