import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-select-dialog',
  templateUrl: './select-dialog.component.html',
  styleUrls: ['./select-dialog.component.css']
})
export class SelectDialogComponent implements OnInit {

  passedData: any = {
    radioBtns: ['Customer_Name', 'Customer_Number'],
    showDangerBtn: false,
    showPrimaryBtn: false
  }

  radioForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogtRef: MatDialogRef<SelectDialogComponent>,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.buildForms();
    this.passedData = this.data;
    console.log(this.passedData);

  }

  close(){
    this.dialogtRef.close();
  }

  onSubmit(){
    this.dialogtRef.close(this.radioForm.get('radio').value);
  }

  buildForms(){
    this.radioForm = this.formBuilder.group({
      radio:['']
    })
  }

}
