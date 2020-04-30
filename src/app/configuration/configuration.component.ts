import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataService} from '../services/data.service';
import {MalariaOrgUnitModel} from '../models/malaria-orgUnit-model';
import {MalariaIndicatorModel} from '../models/malaria-indicator-model';
import {MalariaGroupModel} from '../models/malaria-group-model';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})

export class ConfigurationComponent implements OnInit {
  orgUnitLevel: any[] = [];
  dsIndicators: MalariaIndicatorModel[];
  dsGroups: MalariaGroupModel[];
  dsOULevel: MalariaOrgUnitModel;
  modeForm = false;
  items: FormArray;
  constructor( private loadData: HttpClient, private dataSeries: DataService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getOrganitUnitLevel();
    this.getIndicatorDataStore();
  }
  createItem( indicatorType: string, id: string): FormGroup {
    return this.formBuilder.group({
      type: indicatorType,
      dhisID: id
    });
  }
  getOrganitUnitLevel(): void {
    this.dataSeries.getOrganisationUnitLevels().subscribe( (orglevelData: any ) => {
      for (const dName of orglevelData.organisationUnitLevels){
        this.orgUnitLevel.push({
          displayName: dName.displayName
        });
      }
    });
  }
  getIndicatorDataStore(): void {
    this.dataSeries.getDataStore().subscribe(dst => {
      this.dsIndicators = dst.indicators;
      this.items.clear();
      this.dsIndicators.forEach(indicator => {
        this.items.push(this.createItem(indicator.type, indicator.dhisID));
      });
      console.log(this.dsIndicators);
      this.dsGroups = dst.indicatorGroup;
      this.dsOULevel = dst.orgUnitLevel;
    });
  }
  tableFormActive(){
    this.modeForm = true;
  }
  saveIndicator(){
    this.modeForm = false;
  }
}

