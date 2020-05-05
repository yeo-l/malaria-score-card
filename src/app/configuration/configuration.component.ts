import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataService} from '../services/data.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MalariaDataStoreModel} from "../models/malaria-data-store-model";
import {NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";
import {merge, Observable, Subject} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map} from "rxjs/operators";

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})

export class ConfigurationComponent implements OnInit {
  orgUnitLevels: any[] = [];
  dataStore: MalariaDataStoreModel = new MalariaDataStoreModel();
  dataElementObjectName: {} = {};
  indicatorObjectName: {} = {};
  modeForm = false;
  editId: any = '-1';
  elements: {} = {};
  elementList: [{}] = [{}];
  elementsBoard: [[]] = [[]];

  // items: FormArray;
   editing: boolean = false;

  // @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  // focus$ = new Subject<string>();
  // click$ = new Subject<string>();
  constructor( private loadData: HttpClient, private dataSeries: DataService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getIndicatorDataStore();
  }

  // search = (text$: Observable<string>) => {
  //   let list:[{}] = [{}];
  //   Object.keys(this.elementList[parseInt(this.editId)]).forEach((el:{
  //     value: string;
  //     key: string;
  //   }) => {
  //     list.push({id: el.key, value: el.value});
  //   });
  //   const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
  //   const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
  //   const inputFocus$ = this.focus$;
  //
  //   return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
  //     map(term => (term === '' ? this.elementList[parseInt(this.editId)]
  //       : this.elementList[parseInt(this.editId)].filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
  //   );
  // };

  async getOrgUnitUnitLevel(): Promise<void> {
    const params: string[] = ['fields=name,level'];
    await this.dataSeries.loadMetaData('organisationUnitLevels', params).subscribe((levels: any) => {
      this.orgUnitLevels = levels.organisationUnitLevels;
    });
  }

  createEmptyElement() {
    for (let i = 0; i < this.dataStore.indicators.length; i++) {
      this.elementList.push({});
    }
  }

  editField(val){
    this.editing = true;
    this.editId = val;
    if (this.dataStore.indicators[parseInt(val)].type === 'data element') {
      this.getDataElements(parseInt(val));
    } else if (this.dataStore.indicators[parseInt(val)].type === 'indicator') {
      this.getIndicators(parseInt(val));
    }
  }
  async getIndicatorDataStore(): Promise<void> {
    await this.dataSeries.getDataStore().subscribe(dataStore => {
      this.dataStore = dataStore;
      this.createEmptyElement();
      this.getOrgUnitUnitLevel();
    });
  }
  tableFormActive(){
    this.modeForm = true;
  }
  saveIndicator(){
    this.modeForm = false;
  }

  saveDataStore(){
    for (let i = 0; i <= this.dataStore.indicators.length; i++) {
      if (this.dataStore.indicators[i]) {
        if (this.dataStore.indicators[i].dhisID){
          if (this.dataStore.indicators[i].type === 'data element') {
            this.dataStore.indicators[i].dhisName = this.dataElementObjectName[(this.dataStore.indicators[i].dhisID)];
          } else if (this.dataStore.indicators[i].type === 'indicator') {
            this.dataStore.indicators[i].dhisName = this.indicatorObjectName[(this.dataStore.indicators[i].dhisID)];
          }
        }
      }
    }
    this.dataSeries.update(this.dataStore).subscribe(data => {
      this.editId = '-1';
      console.log(data);
    });
  }

  cancelEdit(){
    this.editId = '-1';
    this.elementsBoard =[[]];
    this.createEmptyElement();
    this.elements = {};
  }

  async getIndicators(index: number) {
    const params = ['fields=id,name'];
    this.elementsBoard = [[]];
    await this.dataSeries.loadIndicators(params).subscribe((data: any) => {
      // console.log(data);
      this.elementsBoard[index] = data.indicators;
      data.indicators.forEach((indicator:any) => {
        this.elements[indicator.id] = indicator.name;
        this.elementList[index] = this.elements;
        this.indicatorObjectName[indicator.id] = indicator.name;
      });
      //console.log(this.indicatorObjectName);
    });
  }
  async getDataElements(index: number) {
    const params = ['fields=id,name'];
    this.elementsBoard = [[]];
    await this.dataSeries.loadDataElements(params).subscribe((data: any) => {
      //console.log(data);
      this.elementsBoard[index] = data.dataElements;
      data.dataElements.forEach((de: any) => {
        this.elements[de.id] = de.name;
        this.elementList[index] = this.elements;
        this.dataElementObjectName[de.id] = de.name;
      });
    });
  }

  loadElement(val, index: number) {
    console.log(val);
    this.elements = {};
    this.createEmptyElement();
    if (val === 'data element') {
      this.getDataElements(index);
    } else if (val === 'indicator') {
      this.getIndicators(index);
    }
  }
}

