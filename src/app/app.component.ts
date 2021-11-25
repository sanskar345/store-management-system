import { Component, OnInit } from '@angular/core';
import { UiService } from './core/services/ui.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'store-management-system';
  isLoading = false;

  constructor(
    private uiService: UiService
  ) { }

  ngOnInit() {
    this.uiService.loadingChecker.subscribe(
      res => {
        if (res) {
          this.isLoading = true;
        } else {
          this.isLoading = false;
        }
      }
    );
  }
}
