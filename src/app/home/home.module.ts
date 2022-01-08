import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatDividerModule } from "@angular/material/divider";
import { MatStepperModule } from "@angular/material/stepper";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { TestComponent } from "./test/test.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ModalsModule } from "../modals/modals.module";
import { HomeHeaderComponent } from './home-header/home-header.component';
import { SettingsComponent } from './settings/settings.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { CustomersComponent } from './customers/customers.component';
import {MatCardModule} from '@angular/material/card';
import { InventoryComponent } from './inventory/inventory.component';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import {MatDialogModule} from "@angular/material/dialog";
import { DialogsModule } from "../dialogs/dialogs.module";
import { TransactionsComponent } from './transactions/transactions.component';
import { CreditsComponent } from './credits/credits.component';
import { ReportsComponent } from './reports/reports.component';
import { ChartsModule } from 'ng2-charts';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { AlertsComponent } from './alerts/alerts.component';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { BottomSheetsModule } from "../bottom-sheets/bottom-sheets.module";
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    HomeComponent,
    TestComponent,
    DashboardComponent,
    HomeHeaderComponent,
    SettingsComponent,
    CustomersComponent,
    InventoryComponent,
    TransactionsComponent,
    CreditsComponent,
    ReportsComponent,
    AlertsComponent,

  ],
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    SharedModule,
    MatButtonModule,
    MatSidenavModule,
    MatDividerModule,
    MatStepperModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatIconModule,
    FontAwesomeModule,
    ModalsModule,
    MatGridListModule,
    MatCardModule,
    MatPaginatorModule,
    MatMenuModule,
    MatDialogModule,
    DialogsModule,
    ChartsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    MatBottomSheetModule,
    BottomSheetsModule,
    NgxSpinnerModule
  ],
  providers: [
     MatPaginatorIntl,
  ]
})

export class HomeModule {}
