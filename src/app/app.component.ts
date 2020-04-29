import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from './shared/constants';
import {DataService} from './services/data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'malaria-score-card';
  constructor(public translate: TranslateService, private httpClient: HttpClient, private dataSeries: DataService) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }
  ngOnInit(){
    this.postMalariaDataStore();
    console.log(this.dataSeries.tdata);
  }
  postMalariaDataStore(){
    this.dataSeries.postDataStore().subscribe(malariaData => {
      console.log(malariaData);
    });
  }
}
