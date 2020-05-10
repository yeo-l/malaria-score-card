import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../services/data.service';
import {MalariaDataStoreModel} from '../models/malaria-data-store-model';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {dtOptions, dtOptionsExcelPrintButtons} from '../shared/constants';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
 // @ViewChild('htmlData') htmlData: ElementRef;
 @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = dtOptions;
  dtTrigger: Subject<any> = new Subject();

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
  loadingRegionData: boolean = true;
  printHovered = false;
  img1Hovered = false;
  img2Hovered = false;
  img3Hovered = false;
  img4Hovered = false;
  img5Hovered = false;
  img6Hovered = false;

  exportAsConfig: ExportAsConfig = {
    type: 'png',
    elementIdOrContent: 'regionCard',
  };
  exportTable2: ExportAsConfig = {
    type: 'png',
    elementIdOrContent: 'tableRegionPeriod',
  };
  exportTable3: ExportAsConfig = {
    type: 'png',
    elementIdOrContent: 'tableDistrictFacility',
  };
  exportTable4: ExportAsConfig = {
    type: 'png',
    elementIdOrContent: 'tableDistrictPeriod',
  }
  exportTable5: ExportAsConfig = {
    type: 'png',
    elementIdOrContent: 'tableFacilityChw',
  }
  exportTable6: ExportAsConfig = {
    type: 'png',
    elementIdOrContent: 'tableFacilityPeriod',
  }

  constructor( private dataSeries: DataService, private exportAsService: ExportAsService) {}

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

  ImgRegionDistrict() {
    this.exportAsService.save(this.exportAsConfig, 'districts of region').subscribe(() => {
    });
    this.exportAsService.get(this.exportAsConfig).subscribe(content => {
      console.log(content);
    });
  }
  imgRegPer() {
    this.exportAsService.save(this.exportTable2, 'Regions of Period').subscribe(() => {
    });
    this.exportAsService.get(this.exportTable2).subscribe(content => {
      console.log(content);
    });
  }
  imgDistrictFacility() {
    this.exportAsService.save(this.exportTable3, 'facility of district').subscribe(() => {
    });
    this.exportAsService.get(this.exportTable3).subscribe(content => {
      console.log(content);
    });
  }
  imgDistPer() {
    this.exportAsService.save(this.exportTable4, 'district of Period').subscribe(() => {
    });
    this.exportAsService.get(this.exportTable4).subscribe(content => {
      console.log(content);
    });
  }
  imgFacilityChw() {
    this.exportAsService.save(this.exportTable5, 'facility oh chw').subscribe(() => {
    });
    this.exportAsService.get(this.exportTable5).subscribe(content => {
      console.log(content);
    });
  }
  imgFacilityPer() {
    this.exportAsService.save(this.exportTable6, 'facility of Period').subscribe(() => {
    });
    this.exportAsService.get(this.exportTable6).subscribe(content => {
      console.log(content);
    });
  }
  browserPrint() {
    window.print();
  }
  getOrgUnitRegion(){
    this.loadingRegionData = false;
    const params: string[] = ['fields=id,name&filter=level:eq:' + this.dataStore.orgUnitLevel[0].region];
    this.dataSeries.loadOrganisationUnits(params).subscribe( (OURegion: any) => {
      this.regions = OURegion.organisationUnits;
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
        console.log('header',  this.regionDataHeaders);
        console.log('columnd', this.regionDataByDistrict);
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
