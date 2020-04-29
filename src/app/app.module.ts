import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ScoreComponent } from './score/score.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxDhis2MenuModule} from '@hisptz/ngx-dhis2-menu';
import {NgxDhis2HttpClientModule} from '@iapps/ngx-dhis2-http-client';
import { DataElementMapingComponent } from './data-element-maping/data-element-maping.component';
import { PeriodeFilterComponent } from './periode-filter/periode-filter.component';
import {NgxDhis2PeriodFilterModule} from '@iapps/ngx-dhis2-period-filter';
import { LayoutComponent } from './layout/layout.component';
import {TreeModule} from 'angular-tree-component';
import {TreeviewModule} from 'ngx-treeview';
import {DndModule} from 'ng2-dnd';


export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    ConfigurationComponent,
    ScoreComponent,
    DataElementMapingComponent,
    PeriodeFilterComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, NgxDhis2MenuModule,
    BrowserAnimationsModule, TreeviewModule.forRoot(),
    NgxDhis2HttpClientModule.forRoot({
      namespace: 'malariaScoreCard',
      version: 1,
      models: {}
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }), ReactiveFormsModule, NgxDhis2PeriodFilterModule, TreeModule, DndModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
