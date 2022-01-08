import { Component, OnInit } from '@angular/core';
import { UiService } from './core/services/ui.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'store-management-system';

  constructor(
    private uiService: UiService
  ) { }

  ngOnInit() {
  }
}
