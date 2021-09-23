import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
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



@NgModule({
  declarations: [
    HomeComponent,
    TestComponent,
    DashboardComponent,
    HomeHeaderComponent,
    SettingsComponent,

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
    ModalsModule
  ]
})

export class HomeModule {}
