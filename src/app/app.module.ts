import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ScoreComponent } from './score/score.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxDhis2MenuModule} from '@hisptz/ngx-dhis2-menu';
import {NgxDhis2HttpClientModule} from '@iapps/ngx-dhis2-http-client';
import { PeriodeFilterComponent } from './periode-filter/periode-filter.component';
import {NgxDhis2PeriodFilterModule} from '@iapps/ngx-dhis2-period-filter';
import { LayoutComponent } from './layout/layout.component';
import {DndModule} from 'ng2-dnd';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from "@ng-select/ng-select";
import {NgxPrintModule} from 'ngx-print';
// import {DataTablesModule} from 'angular-datatables';
import {MatTableModule} from '@angular/material/table';
import {ExportAsModule} from 'ngx-export-as';



export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    ConfigurationComponent,
    ScoreComponent,
    PeriodeFilterComponent,
    LayoutComponent
  ],
    imports: [
        BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, NgxDhis2MenuModule,
        NgSelectModule, NgxPrintModule, ExportAsModule, // DataTablesModule
        BrowserAnimationsModule,
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
        }), ReactiveFormsModule, NgxDhis2PeriodFilterModule, DndModule, NgbModule, MatTableModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
