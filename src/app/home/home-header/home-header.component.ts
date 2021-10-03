import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.css']
})
export class HomeHeaderComponent implements OnInit {

  @Input() title: string;

  today: Date;

  constructor() { }

  ngOnInit(): void {
    this.today = new Date();
  }

}
