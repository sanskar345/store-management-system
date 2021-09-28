import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-store-photo-modal',
  templateUrl: './change-store-photo-modal.component.html',
  styleUrls: ['./change-store-photo-modal.component.css']
})
export class ChangeStorePhotoModalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onSelectFile(event){

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = ((e) => {
      console.log(e);

    });

  }

}
