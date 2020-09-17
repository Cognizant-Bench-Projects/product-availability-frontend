import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TitleComponent } from './component/title/title.component';
import { SearchComponent } from './component/search/search.component';
import { ContentComponent } from './component/content/content.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from './component/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    TitleComponent,
    SearchComponent,
    ContentComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
