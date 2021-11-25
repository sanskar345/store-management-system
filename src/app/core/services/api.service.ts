import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ADD_CUSTOMER, ADD_ITEM_CATEGORY, LOGIN, SIGN_UP, STOREUP_API } from '../constants/apis.constant';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService
    ) { }

  signUpUser(data: {}){
    return this.http.post(
      `${STOREUP_API}${SIGN_UP}`,
      data
    );
  };

  loginUser(data: {}){
    return this.http.post(
      `${STOREUP_API}${LOGIN}`,
      data
    );
  };

  addCustomer(data: {
    name: string,
    mobileNumber: string,
    address: string,
    credit: Number,
    dob: string
  }){
    data = Object.assign(data, {adminIdFk: this.storageService.getAdminIdFk()});
    return this.http.post(
      `${STOREUP_API}${ADD_CUSTOMER}`,
      data
    );
  };

  addItemCategory(data: { name: string }){
    data = Object.assign(data, {adminIdFk: this.storageService.getAdminIdFk()});
    return this.http.post(
      `${STOREUP_API}${ADD_ITEM_CATEGORY}`,
      data
    );
  }

}
