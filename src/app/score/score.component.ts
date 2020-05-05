import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../services/data.service';
import {MalariaDataStoreModel} from '../models/malaria-data-store-model';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
  @ViewChild('htmlData') htmlData: ElementRef;
  dataStore: MalariaDataStoreModel;
  regions: any = [{}];
  districts: any = [{}];
  facilities: any = [{}];
  choisePlay: string;
  chws: any = [{}];
  selectedRegion: string;
  selectedDistrict: string;
  selectedFacility: string;
  elementName: {} = {};
  regionDataByDistrict: string[][] = [];
  regionDataHeaders: any = [];
  regionInGray = 0; regionInRed = 0;
  regionInGreen = 0; regionInYellow = 0;
  districtInGray = 0; districtInRed = 0;
  districtInGreen = 0; districtInYellow = 0;
  facilityInGray = 0; facilityInRed = 0;
  facilityInGreen = 0; facilityInYellow = 0;
  regionDataByDistrictPeriod: string[][] = [];
  regionDataHeadersByPeriod: any = [];
  districtDataByFacility: string[][] = [];
  districtDataHeaders: any = [];
  districtDataByDistrictPeriod: string[][] = [];
  districtDataHeadersByPeriod: any = [];
  facilityDataByCommunity: string[][] = [];
  facilityDataHeaders: any = [];
  facilityDataByChwPeriod: string[][] = [];
  facilityDataHeadersByPeriod: any = [];
  selectedRegionName: string;
  selectedDistrictName: string;
  selectedFacilityName: string;
  constructor( private dataSeries: DataService) { }


  ngOnInit(): void {
    this.dataSeries.getDataStore().subscribe( ds => {
      this.dataStore = ds;
      this.dataStore.indicators.forEach(indicator => {
        if (indicator.dhisID !== null){
          this.elementName[indicator.dhisID] = indicator.name;
        }
      });
      this.getOrgUnitRegion();
      this.getOrgUnitDistrict();
      this.getOrgUnitChw();
      this.getOrgUnitFacility();
    });
  }
  public downloadPDF(): void {
    const DATA = this.htmlData.nativeElement;
    const doc = new jsPDF('p', 'pt', 'a4');

    const handleElement = {
      '#editor'(element, renderer){
        return true;
      }
    };
    doc.fromHTML(DATA.innerHTML, 15, 15, {
      width: 300,
      elementHandlers: handleElement
    });

    // doc.save('text.pdf');
    doc.output('dataurlnewwindow');
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
  getDimensionDx(){
    const elements: string[] = [];
    for (let i = 0 ; i < this.dataStore.indicators.length; i++){
      if (this.dataStore.indicators[i].dhisID){
        elements[i] = this.dataStore.indicators[i].dhisID;
      }
    }
    if (elements.length){
      return elements.join(';');
    }
    return null;
  }
  getFacilityDataByPeriodFilter(){
    const dx = this.getDimensionDx();
    const levelF: string = this.dataStore.orgUnitLevel[0].chw;
    if (dx !== null){
      this.dataSeries.getDataByPeriodFilter(this.selectedFacility, dx, levelF).subscribe( (data: any) => {
        const rows = data.rows;
        const headers = data.headers;
        this.facilityDataByCommunity = [];
        this.facilityDataHeaders = [];
        this.facilityInGreen = 0;
        this.facilityInGray = 0;
        this.facilityInYellow = 0;
        this.facilityInRed   = 0;
        for (let i = 0; i < rows.length; i++){
          const columns = rows[i];
          let count = 0;
          const columnData: string[] = [];
          for (let j = 0; j < columns.length; j++){
            if (headers[j].column === 'dataid'){
              columnData[count] = this.elementName[columns[j]];
              this.facilityDataHeaders[count] = '';
              count++;
            }
            else if (headers[j].column !== 'datacode' && headers[j].column !== 'datadescription' && headers[j].column !== 'dataname'){
              columnData[count] = columns[j];
              this.facilityDataHeaders[count] = headers[j].column;
              count ++;
              if (parseFloat(columns[j]) >= 70){
                this.facilityInGreen ++;
              }
              if (parseFloat(columns[j]) < 40){
                this.facilityInRed ++;
              }
              if (isNaN(parseFloat(columns[j]))){
                this.facilityInGray ++;
              }
              if (parseFloat(columns[j]) < 70 && parseFloat(columns[j]) >= 40){
                this.facilityInYellow ++;
              }
            }
          }
          this.facilityDataByCommunity.push(columnData);
        }
      });
      this.getFacilityDataByOrgUnitFilter();
      this.getDistrictDataByOrgUnitFilter();
      this.facilities.forEach(facility => {
        if (facility.id === this.selectedFacility){
          this.selectedFacilityName = facility.name;
        }
      });
    }
  }
  getDistrictDataByPeriodFilter(){
    const dx = this.getDimensionDx();
    const levelD: string = this.dataStore.orgUnitLevel[0].facility;
    if (dx !== null){
      this.dataSeries.getDataByPeriodFilter(this.selectedDistrict, dx, levelD).subscribe((data: any) => {
        const rows = data.rows;
        const headers = data.headers;
        this.districtDataByFacility = [];
        this.districtDataHeaders = [];
        this.districtInGreen = 0;
        this.districtInGray = 0;
        this.districtInYellow = 0;
        this.districtInRed = 0;
        for (let i = 0; i < rows.length; i++){
          const columns = rows[i];
          let count = 0;
          const columnData: string[] = [];
          for (let j = 0; j < columns.length; j++){
            if (headers[j].column === 'dataid'){
              columnData[count] = this.elementName[columns[j]];
              this.districtDataHeaders[count] = '';
              count++;
            }
            else if (headers[j].column !== 'datacode' && headers[j].column !== 'datadescription' && headers[j].column !== 'dataname'){
              columnData[count] = columns[j];
              this.districtDataHeaders[count] = headers[j].column;
              count ++;
              if (parseFloat(columns[j]) >= 70){
                this.districtInGreen ++;
              }
              if (parseFloat(columns[j]) < 40){
                this.districtInRed ++;
              }
              if (isNaN(parseFloat(columns[j]))){
                this.districtInGray ++;
              }
              if (parseFloat(columns[j]) < 70 && parseFloat(columns[j]) >= 40){
                this.districtInYellow ++;
              }
            }
          }
          this.districtDataByFacility.push(columnData);
        }
      });
    }
    this.getDistrictDataByOrgUnitFilter();
    this.districts.forEach(district => {
      if (district.id === this.selectedDistrict){
        this.selectedDistrictName = district.name;
      }
    });
  }
  getRegionDataByPeriodFilter(){
    const levelR: string = this.dataStore.orgUnitLevel[0].district;
    const dx = this.getDimensionDx();
    if (dx !== null){
      this.dataSeries.getDataByPeriodFilter(this.selectedRegion, dx, levelR).subscribe( (data: any) => {
        const rows = data.rows;
        console.log(data);
        const headers = data.headers;
        this.regionDataByDistrict = [];
        this.regionDataHeaders = [];
        this.regionInGreen = 0;
        this.regionInGray = 0;
        this.regionInYellow = 0;
        this.regionInRed = 0;
        for (let i = 0; i < rows.length; i++){
          const columns = rows[i];
          let count = 0;
          const columnData: string[] = [];
          for (let j = 0; j < columns.length; j++){
            if (headers[j].column === 'dataid'){
              columnData[count] = this.elementName[columns[j]];
              this.regionDataHeaders[count] = '';
              count++;
            }
            else if (headers[j].column !== 'datacode' && headers[j].column !== 'datadescription' && headers[j].column !== 'dataname'){
              columnData[count] = columns[j];
              this.regionDataHeaders[count] = headers[j].column;
              count ++;
              // console.log(parseFloat(columns[j]));
              if (parseFloat(columns[j]) >= 70){
                this.regionInGreen ++;
              }
              if (parseFloat(columns[j]) < 40){
                this.regionInRed ++;
              }

              if (isNaN(parseFloat(columns[j]))){
                this.regionInGray ++;
                // console.log(parseFloat(columns[j]));
              }
              if (parseFloat(columns[j]) < 70 && parseFloat(columns[j]) >= 40){
                this.regionInYellow ++;
              }
            }
          }
          this.regionDataByDistrict.push(columnData);
        }
      });
    }
    this.getRegionDataByOrgUnitFilter();
    this.regions.forEach(region => {
      if (region.id === this.selectedRegion){
        this.selectedRegionName = region.name;
      }
    });
  }
  getDistrictDataByOrgUnitFilter(){
    const dx = this.getDimensionDx();
    if (dx !== null){
      this.dataSeries.getDataByOrgUnitFilter(this.selectedDistrict, dx).subscribe((data: any) => {
        const rows = data.rows;
        const headers = data.headers;
        this.districtDataByDistrictPeriod = [];
        this.districtDataHeadersByPeriod = [];
        for (let i = 0; i < rows.length; i++) {
          const columns = rows[i];
          let count = 0;
          const columnData: string[] = [];
          for (let j = 0; j < columns.length; j++) {
            if (headers[j].column === 'dataid') {
              columnData[count] = this.elementName[columns[j]];
              this.districtDataHeadersByPeriod[count] = '';
              count++;
            } else if (headers[j].column !== 'datacode' && headers[j].column !== 'datadescription' && headers[j].column !== 'dataname') {
              columnData[count] = columns[j];
              this.districtDataHeadersByPeriod[count] = headers[j].column;
              count++;
            }
          }
          this.districtDataByDistrictPeriod.push(columnData);
        }
      });
    }
  }
  getFacilityDataByOrgUnitFilter(){
    const dx = this.getDimensionDx();
    if (dx !== null){
      this.dataSeries.getDataByOrgUnitFilter(this.selectedFacility, dx).subscribe((data: any) => {
        const rows = data.rows;
        const headers = data.headers;
        this.facilityDataByChwPeriod = [];
        this.facilityDataHeadersByPeriod = [];
        for (let i = 0; i < rows.length; i++) {
          const columns = rows[i];
          let count = 0;
          const columnData: string[] = [];
          for (let j = 0; j < columns.length; j++) {
            if (headers[j].column === 'dataid') {
              columnData[count] = this.elementName[columns[j]];
              this.facilityDataHeadersByPeriod[count] = '';
              count++;
            } else if (headers[j].column !== 'datacode' && headers[j].column !== 'datadescription' && headers[j].column !== 'dataname') {
              columnData[count] = columns[j];
              this.facilityDataHeadersByPeriod[count] = headers[j].column;
              count++;
            }
          }
          this.facilityDataByChwPeriod.push(columnData);
        }
      });
    }
  }
  getRegionDataByOrgUnitFilter(){
    const dx = this.getDimensionDx();
    if (dx !== null){
      this.dataSeries.getDataByOrgUnitFilter(this.selectedRegion, dx).subscribe((data: any) => {
        const rows = data.rows;
        const headers = data.headers;
        this.regionDataByDistrictPeriod = [];
        this.regionDataHeadersByPeriod = [];
        for (let i = 0; i < rows.length; i++){
          const columns = rows[i];
          let count = 0;
          const columnData: string[] = [];
          for (let j = 0; j < columns.length; j++){
            if (headers[j].column === 'dataid'){
              columnData[count] = this.elementName[columns[j]];
              this.regionDataHeadersByPeriod[count] = '';
              count++;
            }
            else if (headers[j].column !== 'datacode' && headers[j].column !== 'datadescription' && headers[j].column !== 'dataname'){
              columnData[count] = columns[j];
              this.regionDataHeadersByPeriod[count] = headers[j].column;
              count ++;
            }
          }
          this.regionDataByDistrictPeriod.push(columnData);
        }
      });
    }
  }
}
