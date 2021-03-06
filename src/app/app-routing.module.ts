import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from './app.component';

const appRoutes: Routes = [
  { path: 'product-availbility', component: AppComponent},
  { path: '**', redirectTo: 'product-availbility' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
