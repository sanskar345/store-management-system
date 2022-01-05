import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.css']
})
export class EmptyStateComponent implements OnInit {

  @Input() public actionBtn: boolean;
  @Input() public notFoundImg: boolean;
  @Input() public title: string;
  @Input() public subtitle1: string;
  @Input() public subtitle2: string;

  constructor() { }

  ngOnInit() {}
}
