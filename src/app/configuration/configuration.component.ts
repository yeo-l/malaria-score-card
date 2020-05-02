import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataService} from '../services/data.service';
import {MalariaOrgUnitModel} from '../models/malaria-orgUnit-model';
import {MalariaIndicatorModel} from '../models/malaria-indicator-model';
import {MalariaGroupModel} from '../models/malaria-group-model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MalariaDataStoreModel} from "../models/malaria-data-store-model";

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})

export class ConfigurationComponent implements OnInit {
  orgUnitLevels: any[] = [];
  dsIndicators: MalariaIndicatorModel[];
  dataStore: MalariaDataStoreModel = new MalariaDataStoreModel();
  dsGroups: MalariaGroupModel[];
  dsOULevel: MalariaOrgUnitModel;
  dataElementObjectName: {} = {};
  indicatorObjectName: {} = {};
  modeForm = false;
  editId: any = '-1';
  elements: {} = {};
  elementList: [{}] = [{}];
  elementsBoard: [[]] = [[]];

  // items: FormArray;
   editing: boolean = false;

  constructor( private loadData: HttpClient, private dataSeries: DataService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // jquery('.select2').select2();
    this.getIndicatorDataStore();
  }
  createItem( indicatorType: string, id: string): FormGroup {
    return this.formBuilder.group({
      type: indicatorType,
      dhisID: id
    });
  }
  async getOrgUnitUnitLevel(): Promise<void> {
    const params: string[] = ['fields=name,level'];
    await this.dataSeries.loadMetaData('organisationUnitLevels', params).subscribe((levels: any) => {
      // console.log(levels);
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
      // this.dsIndicators = dataStore.indicators;
      // this.items.clear();
      // this.dsIndicators.forEach(indicator => {
      //   this.items.push(this.createItem(indicator.type, indicator.dhisID));
      // });
      // console.log(this.dsIndicators);
      // this.dsGroups = dataStore.indicatorGroup;
      // this.dsOULevel = dataStore.orgUnitLevel;
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
      // console.log(this.dataStore.indicators[i]);
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
    // console.log(this.dataStore.indicators);
    this.dataSeries.update(this.dataStore).subscribe(data => {
      this.editId = '-1';
      console.log(data);
    });
  }
  saveOrgUnitLevel(){
    this.dataSeries.update(this.dataStore).subscribe(data => {
    });
  };

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

      // console.log(this.indicatorObjectName);
    });
  }
  async getDataElements(index: number) {
    const params = ['fields=id,name'];
    this.elementsBoard = [[]];
    await this.dataSeries.loadDataElements(params).subscribe((data: any) => {
      // console.log(data);
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

