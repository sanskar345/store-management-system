import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomersComponent } from "./customers/customers.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HomeComponent } from "./home.component";
import { SettingsComponent } from "./settings/settings.component";
import { TestComponent } from "./test/test.component";

const routes: Routes = [
  {path: '',
  component: HomeComponent,
  children: [
    {path: '', component: DashboardComponent },
    {path: 'test', component: TestComponent },
    {path: 'dashboard', component: DashboardComponent },
    {path: 'settings', component: SettingsComponent },
    {path: 'customers', component: CustomersComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}