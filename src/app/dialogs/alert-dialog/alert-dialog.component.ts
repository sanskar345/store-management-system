import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent implements OnInit {

  passedData: any = {
    showDangerBtn: false,
    showPrimaryBtn: false
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogtRef: MatDialogRef<AlertDialogComponent>
  ) { }

  ngOnInit(): void {

    this.passedData = this.data;
    console.log(this.passedData);

  }

  close(){
    this.dialogtRef.close(false);
  }

  onClickDangerBtn(){
    this.dialogtRef.close(true);
  }



}
