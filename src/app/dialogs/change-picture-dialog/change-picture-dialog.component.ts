import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-change-picture-dialog',
  templateUrl: './change-picture-dialog.component.html',
  styleUrls: ['./change-picture-dialog.component.css']
})
export class ChangePictureDialogComponent implements OnInit {

  passedData: any = {

  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogtRef: MatDialogRef<ChangePictureDialogComponent>
  ) { }

  ngOnInit(): void {

    this.passedData = this.data;
    console.log(this.passedData);

  }

  close(){
    this.dialogtRef.close('sanskar')
  }

  onSelectFile(event){

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = ((e) => {
      console.log(e);

    });

  }

}
