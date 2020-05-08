import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataService} from '../services/data.service';
import {FormBuilder} from '@angular/forms';
import {MalariaDataStoreModel} from "../models/malaria-data-store-model";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";

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
  staticAlertClosed = false;
  private _success = new Subject<string>();
  successMessage = '';

  // items: FormArray;
  editing: boolean = false;
  loading:boolean = false;
  groupObjectName: {} = {};

  constructor( private loadData: HttpClient, private dataSeries: DataService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getIndicatorDataStore();
    this.createDataElementObject();
    this.createIndicatorObject();
    this.createGroupObject();
    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = '');
  }
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
    for (let i = 0; i < this.dataStore.indicators.length; i++) {
      if (this.dataStore.indicators[i]) {
        if (this.dataStore.indicators[i].dhisID){
          if (this.dataStore.indicators[i].type === 'data element') {
            this.dataStore.indicators[i].dhisName = this.dataElementObjectName[(this.dataStore.indicators[i].dhisID)];
          } else if (this.dataStore.indicators[i].type === 'indicator') {
            this.dataStore.indicators[i].dhisName = this.indicatorObjectName[(this.dataStore.indicators[i].dhisID)];
          }
          this._success.next('Data store updated successfully ');
        }
      }
    }
    this.dataSeries.update(this.dataStore).subscribe(data => {
      this.editId = '-1';
    });
  }

  cancelEdit(){
    this.editId = '-1';
    this.elementsBoard =[[]];
    this.createEmptyElement();
    this.elements = {};
  }

  async getIndicators(index: number) {
    this.loading = true;
    const params = ['fields=id,name'];
    this.elementsBoard = [[]];
    await this.dataSeries.loadIndicators(params).subscribe((data: any) => {
      this.elementsBoard[index] = data.indicators;
      data.indicators.forEach((indicator:any) => {
        this.elements[indicator.id] = indicator.name;
        this.elementList[index] = this.elements;
      });
      if (this.elements && this.elementList && this.indicatorObjectName) {
        this.loading = false;
      }
    });
  }
  async getDataElements(index: number) {
    this.loading = true;
    const params = ['fields=id,name'];
    this.elementsBoard = [[]];
    await this.dataSeries.loadDataElements(params).subscribe((data: any) => {
      this.elementsBoard[index] = data.dataElements;
      data.dataElements.forEach((de: any) => {
        this.elements[de.id] = de.name;
        this.elementList[index] = this.elements;
      });
      if (this.elements && this.elementList && this.indicatorObjectName) {
        this.loading = false;
      }
    });
  }
  createIndicatorObject(){
    const params = ['fields=id,name'];
    this.dataSeries.loadIndicators(params).subscribe((data: any) => {
      data.indicators.forEach((de: any) => {
        this.indicatorObjectName[de.id] = de.name;
      });
    });
  }
  createGroupObject(){
    this.dataSeries.getDataStore().subscribe((data: any) => {
      data.indicatorGroup.forEach((g: any) => {
        this.groupObjectName[g.code] = g.groupCode;
      });
    });
  }
  createDataElementObject(){
    const params = ['fields=id,name'];
    this.dataSeries.loadDataElements(params).subscribe((data: any) => {
      data.dataElements.forEach((de: any) => {
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

