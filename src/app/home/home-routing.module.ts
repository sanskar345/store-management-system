import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AlertsComponent } from "./alerts/alerts.component";
import { CreditsComponent } from "./credits/credits.component";
import { CustomersComponent } from "./customers/customers.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HomeComponent } from "./home.component";
import { InfoComponent } from "./info/info.component";
import { InventoryComponent } from "./inventory/inventory.component";
import { ReportsComponent } from "./reports/reports.component";
import { SettingsComponent } from "./settings/settings.component";
import { TransactionsComponent } from "./transactions/transactions.component";

const routes: Routes = [
  {path: '',
  component: HomeComponent,
  children: [
    {path: '', component: DashboardComponent },
    {path: 'dashboard', component: DashboardComponent },
    {path: 'settings', component: SettingsComponent },
    {path: 'customers', component: CustomersComponent },
    {path: 'inventory', component: InventoryComponent },
    {path: 'transactions', component: TransactionsComponent },
    {path: 'credits', component: CreditsComponent },
    {path: 'reports', component: ReportsComponent },
    {path: 'alerts', component: AlertsComponent },
    {path: 'help', component: InfoComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
