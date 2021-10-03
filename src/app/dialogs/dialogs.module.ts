import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';



@NgModule({
  declarations: [
    AlertDialogComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlertDialogComponent
  ]
})
export class DialogsModule { }
