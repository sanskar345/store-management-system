import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: [
    './auth.component.css']
})
export class AuthComponent implements OnInit {

  showAdminLogin = false;
  authenticationForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.buildForms();
  }

  switchMode(){
    this.showAdminLogin = !this.showAdminLogin;
  };

  buildForms(){
    this.authenticationForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  };

  verifyLogin(){
    console.log(this.authenticationForm.get('userName').value);
    console.log(this.authenticationForm.get('password').value);
    this.authenticationForm.reset();

    this.router.navigate(['/home']);
  }

}
