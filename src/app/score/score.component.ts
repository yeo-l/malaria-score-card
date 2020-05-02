import { Component, OnInit } from '@angular/core';
import {TreeviewConfig, TreeviewItem} from 'ngx-treeview';
import {OrgUnitService} from '../services/org-unit.service';
import {DataService} from '../services/data.service';
import {MalariaDataStoreModel} from '../models/malaria-data-store-model';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
 dates: any;
 dataStore: MalariaDataStoreModel;
 regions: any = [{}];
 districts: any = [{}];
 facilities: any = [{}];
 chws: any = [{}];
  constructor( private dataSeries: DataService) { }


  ngOnInit(): void {
    this.dataSeries.getDataStore().subscribe( ds => {
      this.dataStore = ds;
      this.getOrgUnitRegion();
      this.getOrgUnitDistrict();
      this.getOrgUnitChw();
      this.getOrgUnitFacility();
    });
  }
  getDataTest(){
    this.dataSeries.getDataStore().subscribe( dat => {
      this.dates = dat;
    });
  }
  getOrgUnitRegion(){
    const params: string[] = ['fields=id,name&filter=level:eq:' + this.dataStore.orgUnitLevel[0].region];
    this.dataSeries.loadOrganisationUnits(params).subscribe( (OURegion: any) => {
      this.regions = OURegion.organisationUnits;
      console.log(this.regions);
    });
  }
  getOrgUnitDistrict(){
    const params: string[] = ['fields=id,name&filter=level:eq:' + this.dataStore.orgUnitLevel[0].district];
    this.dataSeries.loadOrganisationUnits(params).subscribe( (DistrictData: any) => {
      this.districts = DistrictData.organisationUnits;
    });
  }
  getOrgUnitFacility(){
    const params: string[] = ['fields=id,name&filter=level:eq:' + this.dataStore.orgUnitLevel[0].facility];
    this.dataSeries.loadOrganisationUnits(params).subscribe( (facilityData: any) => {
      this.facilities = facilityData.organisationUnits;
    });
  }
  getOrgUnitChw(){
    const params: string[] = ['fields=id,name&filter=level:eq:' + this.dataStore.orgUnitLevel[0].facility];
    this.dataSeries.loadOrganisationUnits(params).subscribe( (chwData: any) => {
      this.chws = chwData.organisationUnits;
    });
  }
}
