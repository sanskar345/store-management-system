import { Component, OnInit } from '@angular/core';
import {  faFilter } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  faFilter = faFilter;

  filterArray = ['dsfg','sdfsf','sfddsf'];

  constructor() { }

  ngOnInit(): void {
  }

}
