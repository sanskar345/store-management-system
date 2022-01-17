import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { faCalendar, faChartLine, faFilter, faRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { ONLY_NUMBERS } from 'src/app/core/constants/regex.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { UiService } from 'src/app/core/services/ui.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  @ViewChild('input1', {static: true}) input1: ElementRef;

  faRupeeSign = faRupeeSign;
  faFilter = faFilter;
  faChartLine = faChartLine;
  faCalendar = faCalendar;
  filterArray = ['Sales', 'Profit'];
  filter = 'Sales';
  year: number;

  totalTransactions: number;
  totalProfit: number;
  totalCustomers: number;

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
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Sales' }
  ];

  //end of chart

  stats = [];

  yearForm: FormGroup;


  constructor(
    private apiService: ApiService,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.year = (new Date()).getFullYear();
    this.filter = 'Sales';
    this.buildForms();
    this.getTransactionStatsByYear((this.year).toString(), this.filter);
    this.getTransactionStat();
    this.getCustomerStats();
    this.subscribeToInput1();

  }

  changeChart(event) {
    // this.barChartType = event.value;
    this.barChartOptions = {
      responsive: true,
    };
    this.barChartLabels = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    this.barChartType = event.value;
    this.barChartLegend = true;
    this.barChartPlugins = [];

    const duplicateData = this.barChartData[0].data;
    const duplicateLabel = this.barChartData[0].label;

    this.barChartData = [
      { data: duplicateData, label: duplicateLabel }
    ];
  }

  getTransactionStatsByYear(year: string, status: string){
    this.spinner.show('mainSpinner');
    this.apiService.getTransactionStatsByYear(year)
      .subscribe((response: any) => {
        this.spinner.hide('mainSpinner');
        if(response){
          this.stats = response.data.stats;
          if(status === 'Sales'){
            this.setChartDataForSalesPerMonth();
          }
          else if(status === 'Profit'){
            this.setChartDataForProfitPerMonth();
          }
        }

      }, error => {
        this.spinner.hide('mainSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');
      });
  }

  setChartDataForSalesPerMonth(){
    let nData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.stats.forEach((month) => {
      let m = month.month;
      nData[m-1] = month.totalSales;
    });
    this.barChartData = [
      { data: nData, label: 'Sales' }
    ];
  }

  setChartDataForProfitPerMonth(){
    let nData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.stats.forEach((month) => {
      let m = month.month;
      nData[m-1] = month.totalProfit;
    });
    this.barChartData = [
      { data: nData, label: 'Profit' }
    ];
  }

  changeFilter(event){
    this.filter = event.value;

    if(event.value === 'Sales'){
      this.setChartDataForSalesPerMonth();
    }else{
      this.setChartDataForProfitPerMonth();
    }
  }

  buildForms(){
    this.yearForm = this.formBuilder.group({
      cYear: ['', [Validators.minLength(4), Validators.maxLength(4), Validators.pattern(ONLY_NUMBERS)]]
    });
  }

  subscribeToInput1(){
    // server-side search
    fromEvent(this.input1.nativeElement,'keyup')
        .pipe(
            filter(Boolean),
            debounceTime(700),
            distinctUntilChanged(),
            tap((event:KeyboardEvent) => {
              if(this.input1.nativeElement.value.length === 4 && this.yearForm.valid){
                this.year = this.input1.nativeElement.value;
                this.getTransactionStatsByYear((this.input1.nativeElement.value).toString(), this.filter);
              }
            })
        )
        .subscribe();
  }

  getTransactionStat(){
    this.spinner.show('mainSpinner');
    this.apiService.getTransactionStat()
      .subscribe((response: any) => {
        this.spinner.hide('mainSpinner');
        this.totalTransactions = response.data.stats[0].totalTransactions;
        this.totalProfit = response.data.stats[0].totalProfit;

      }, error => {
        this.spinner.hide('mainSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');
      });
  }

  getCustomerStats(){
    this.spinner.show('mainSpinner');
    this.apiService.getCustomerStats()
      .subscribe((response: any) => {
        this.spinner.hide('mainSpinner');
        if(response){
          this.totalCustomers = response.data.stats[0].totalCustomers;
        }
      }, error => {
        this.spinner.hide('mainSpinner');
        this.uiService.openSnackBar(error.error.message, 'Close');
      })
  }

}
