import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  showStoreNameChange = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleShowStoreNameChange() {
    this.showStoreNameChange = !this.showStoreNameChange;
  }

}
