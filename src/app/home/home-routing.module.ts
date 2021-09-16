import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HomeComponent } from "./home.component";
import { TestComponent } from "./test/test.component";

const routes: Routes = [
  {path: '',
  component: HomeComponent,
  children: [
    {path: '', component: DashboardComponent },
    {path: 'test', component: TestComponent },
    {path: 'dashboard', component: DashboardComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
