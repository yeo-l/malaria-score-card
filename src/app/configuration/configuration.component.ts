import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})

export class ConfigurationComponent implements OnInit {
  localData: any = [];
  constructor( private loadData: HttpClient) { }

  ngOnInit(): void {
    this.loadData.get('../malariaDataStore.json').subscribe(dataM => {
      console.log(dataM);
      this.localData = dataM;
      console.log('localdata', this.localData.indicator);
    });
  }
}
