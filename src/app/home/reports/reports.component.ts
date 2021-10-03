import { Component, OnInit } from '@angular/core';
import { faCalendar, faChartLine, faFilter, faRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  faRupeeSign = faRupeeSign;
  faFilter = faFilter;
  faChartLine = faChartLine;
  faCalendar = faCalendar;
  filterArray = ['sales', 'profit']

  //chart

  // different charts -- bar, line, pie, radar, doughnut, polarArea

  // chartType: ChartType = 'bar';

  chartTypeArray = ['bar', 'line', 'pie', 'radar', 'doughnut', 'polarArea', 'horizontalBar'];

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40, 34, 5, 10, 11, 90], label: 'Sales' }
  ];

  //end of chart

  constructor() { }

  ngOnInit(): void {
  }

  changeChart(event) {
    console.log(event.value);
    // this.barChartType = event.value;
    this.barChartOptions = {
      responsive: true,
    };
    this.barChartLabels = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    this.barChartType = event.value;
    this.barChartLegend = true;
    this.barChartPlugins = [];

    this.barChartData = [
      { data: [65, 59, 80, 81, 56, 55, 40, 34, 5, 10, 11, 90], label: 'Sales' }
    ];
  }

}
