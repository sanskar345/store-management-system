import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setString(key: string, value: string) {
    localStorage.setItem(key, value);
      // await Storage.set({ key, value });
  }

  getString(key: string) {
    return localStorage.getItem(key);
    localStorage.getItem(key);
      // return (await Storage.get({ key }));
  }

  getAdminIdFk(){
    const user = JSON.parse(this.getString('user'));
    return user.id;
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

}
