import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataService} from '../services/data.service';
import {MalariaOrgUnitModel} from '../models/malaria-orgUnit-model';
import {MalariaIndicatorModel} from '../models/malaria-indicator-model';
import {MalariaGroupModel} from '../models/malaria-group-model';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {MalariaDataStoreModel} from "../models/malaria-data-store-model";
// import * as jquery from 'jquery';
import {Select2OptionData} from "ng-select2";


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
  select2Data: Select2OptionData[] = [];

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
    // this.dataSeries.getOrganisationUnitLevels().subscribe( (orglevelData: any ) => {
    //   for (const dName of orglevelData.organisationUnitLevels){
    //     this.orgUnitLevel.push({
    //       displayName: dName.displayName
    //     });
    //   }
    // });
  }

  editField(val){
    this.editing = true;
    this.editId = val;
  }
  async getIndicatorDataStore(): Promise<void> {
    await this.dataSeries.getDataStore().subscribe(dataStore => {
      this.dataStore = dataStore;

      this.getIndicators();
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
    this.dataSeries.update(this.dataStore).subscribe()
  }

  async getIndicators() {
    const params = ['fields=id,name'];
    await this.dataSeries.loadIndicators(params).subscribe((data: any) => {
      // console.log(data);
      // this.elements = data;
      data.indicators.forEach((indicator:any) => {
        this.elements[indicator.id] = indicator.name;
        // this.indicatorObjectName[indicator.id] = indicator.name;
      });

      //console.log(this.indicatorObjectName);
    });
  }
  async getDataElements() {
    // const params = ['fields=id,name~rename(text)'];
    const params = ['fields=id,name'];
    this.dataSeries.loadDataElements(params).subscribe((data: any) => {
      console.log(data);
      // this.elements = data;
      data.dataElements.forEach((de: any) => {
        // let option : Select2OptionData = de;

        this.elements[de.id] = de.name;
        // option.text = de.name;
        // option.id = de.id;
        // this.select2Data.push(option);
        // this.dataElementObjectName[de.id] = de.name;
      });
      // console.log(this.select2Data);
      //console.log(this.indicatorObjectName);
    });
  }

  loadElement(val) {
    console.log(val);
    this.elements = {};
    if (val === 'data element') {
      this.getDataElements();
    } else if (val === 'indicator') {
      this.getIndicators();
    }
  }
}

