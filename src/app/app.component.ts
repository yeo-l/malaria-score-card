import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {DataService} from './services/data.service';
import {ExportAsService} from 'ngx-export-as';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'malaria-score-card';
  langId = 'en';
  constructor(public translate: TranslateService, private httpClient: HttpClient, private dataSeries: DataService,
              private exportAsService: ExportAsService) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    // const browserLang = translate.getBrowserLang();
   //  translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }
  ngOnInit(){
    this.getMalariaDataStore();
    // this.uploadDataStore();
  }
  switchLang(lang: string) {
    this.translate.use(lang);
    if (lang !== 'en'){
      this.langId = 'en';
    }
    else
      {
        this.langId = 'fr'; }
  }
  uploadDataStore(){
    this.dataSeries.upload().subscribe(data => {
      console.log(data);
    });
  }
  postMalariaDataStore(){
    this.dataSeries.postDataStore().subscribe(malariaData => {
      console.log(malariaData);
    });
  }
  getMalariaDataStore() {
    this.dataSeries.getDataStore().subscribe(data => {
      // console.log('this data store', data);
    }, dsError => {
      this.postMalariaDataStore();
      console.log('error getting data store', dsError);
    });
  }
}
