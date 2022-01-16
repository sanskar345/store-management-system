import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private router: Router,
    private uiService: UiService
  ) { }

  setString(key: string, value: string) {
    localStorage.setItem(key, value);
      // await Storage.set({ key, value });
  }

  getString(key: string) {
    return localStorage.getItem(key);
      // return (await Storage.get({ key }));
  }

  removeString(key: string){
    localStorage.removeItem(key);
  }

  getAdminIdFk(){
    const user = JSON.parse(this.getString('user'));
    if(user){
      if(user.id){
        return user.id;
      }else{
        this.clear();
        this.uiService.openSnackBar('Unsecure Activity Please Login Again','Close');
        this.router.navigate(['']);
      }
    }else{
      this.clear();
      this.uiService.openSnackBar('Unsecure Activity Please Login Again','Close');
      this.router.navigate(['']);
    }
  }

  // async setObject(key: string, value: any) {
  //     await Storage.set({ key, value: JSON.stringify(value) });
  // }

  // async getObject(key: string): Promise<{ value: any }> {
  //     const ret = await Storage.get({ key });
  //     return JSON.parse(ret.value);
  // }


  // async removeItem(key: string) {
  //     await Storage.remove({ key });
  // }

  clear() {
    // await Storage.clear();
    localStorage.clear();
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  resetPassowrdIsTrue(){
    const rP = localStorage.getItem('resetPassword');
    if(rP){
      if(rP === '1'){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

}
