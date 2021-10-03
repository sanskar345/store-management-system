import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreditsComponent } from "./credits/credits.component";
import { CustomersComponent } from "./customers/customers.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HomeComponent } from "./home.component";
import { InventoryComponent } from "./inventory/inventory.component";
import { ReportsComponent } from "./reports/reports.component";
import { SettingsComponent } from "./settings/settings.component";
import { TestComponent } from "./test/test.component";
import { TransactionsComponent } from "./transactions/transactions.component";

const routes: Routes = [
  {path: '',
  component: HomeComponent,
  children: [
    {path: '', component: DashboardComponent },
    {path: 'test', component: TestComponent },
    {path: 'dashboard', component: DashboardComponent },
    {path: 'settings', component: SettingsComponent },
    {path: 'customers', component: CustomersComponent },
    {path: 'inventory', component: InventoryComponent },
    {path: 'transactions', component: TransactionsComponent },
    {path: 'credits', component: CreditsComponent },
    {path: 'reports', component: ReportsComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
