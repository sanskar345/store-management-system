import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ADD_CUSTOMER, ADD_ITEM_CATEGORY, CUSTOMER, GET_CUSTOMER_STAT_FOR_CREDIT, GET_TODAY_TRANSACTION_STAT, GET_TRANSACTION_STAT, ITEMS, ITEMS_OUT_OF_STOCK, ITEM_CATEGORY, LOGIN, SIGN_UP, STOREUP_API, TRANSACTION } from '../constants/apis.constant';
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

  addItem(data: any){
    data = Object.assign(data, {adminIdFk: this.storageService.getAdminIdFk()});
    return this.http.post(
      `${STOREUP_API}${ITEMS}`,
      data
    )

  };

  getItemCategory(){
    return this.http.get(
      `${STOREUP_API}${ITEM_CATEGORY}`
    );
  }

  //get customers

  getCustomers(){
    return this.http.get(
      `${STOREUP_API}${CUSTOMER}`
    );
  }

  //get items

  getItems(){
    return this.http.get(
      `${STOREUP_API}${ITEMS}`
    );
  }

  // create transaction

  createTransaction(data: any){
    data = Object.assign(data, {adminIdFk: this.storageService.getAdminIdFk()});
    return this.http.post(
      `${STOREUP_API}${TRANSACTION}`,
      data
    )

  };

  //get transaction stats

  getTransactionStat(){
    return this.http.get(
      `${STOREUP_API}${GET_TRANSACTION_STAT}`
    );
  }

  //update customer with id

  updateCustomerById(data, id: string){
    return this.http.patch(
      `${STOREUP_API}${CUSTOMER}${id}`,
      data
    );
  }

  //update item

  updateItemWithId(data, id: string){
    return this.http.patch(
      `${STOREUP_API}${ITEMS}${id}`,
      data
    );
  }

  //get transaction by id

  getTransactionById(id: string){
    return this.http.get(
      `${STOREUP_API}${TRANSACTION}${id}`
    );
  }

  //get transaction by id

  updateTransactionById(id: string, data: any){
    return this.http.patch(
      `${STOREUP_API}${TRANSACTION}${id}`,
      data
    );
  }

  //get customers with queryPArams

  getCustomersWithQueryParams(params: {}){
    return this.http.get(
      `${STOREUP_API}${CUSTOMER}`,
      {
        params
      }
    );
  }

  //get customers stats

  getCustomerStatForCredit(){
    return this.http.get(
      `${STOREUP_API}${GET_CUSTOMER_STAT_FOR_CREDIT}`
    );
  }

  //get transactions

  getTransactions(params: {}){
    return this.http.get(
      `${STOREUP_API}${TRANSACTION}`,
      {
        params
      }
    );
  }

  //get sales today

  getTodayTransactionStats(params){
    return this.http.get(
      `${STOREUP_API}${GET_TODAY_TRANSACTION_STAT}`,
      {
        params
      }
    );
  }

  // get items out of stock

  getItemsOutOfStock(){
    return this.http.get(
      `${STOREUP_API}${ITEMS_OUT_OF_STOCK}`,
    );
  }

}
