import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  // for custom loading
  loadingChecker = new Subject();

  addItemSubject = new Subject();

  constructor(
    private snackBar: MatSnackBar,
  ) { }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
