import {Component, OnInit} from '@angular/core';
import {DataService} from '../services/data.service';
import {MalariaDataStoreModel} from '../models/malaria-data-store-model';
import {ExportAsConfig, ExportAsService, SupportedExtensions} from 'ngx-export-as';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
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
  targetInfo: {} = {};
  orgUnitDataColors: string[][] = [[]];
  periodDataColors: string[][] = [[]];
  orgUnitDataValues: string[][] = [];
  orgUnitHeaders: any = [];
  periodDataValues: string[][] = [];
  periodHeaders: any = [];
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
  config: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'figure1',
    options: {
      jsPDF: {
        orientation: 'landscape'
      },
      //  pdfCallbackFn: this.pdfCallbackFn // to add header and footer
    }
  };

  constructor( private dataService: DataService, private exportAsService: ExportAsService) {}

  ngOnInit(): void {
    this.dataService.getDataStore().subscribe( ds => {
      this.dataStore = ds;
      this.dataStore.indicators.forEach(indicator => {
        if (indicator.dhisID !== null && indicator.dhisID !== ''){
          this.elementName[indicator.dhisID] = indicator.name;
          this.targetInfo[indicator.dhisID + '.achieved'] = indicator.achieved;
          this.targetInfo[indicator.dhisID + '.target'] = indicator.target;
          this.targetInfo[indicator.dhisID + '.notInTrack'] = indicator.notInTrack;
        }
      });
      this.getOrgUnitRegion();
      this.getOrgUnitDistrict();
      this.getOrgUnitChw();
      this.getOrgUnitFacility();
    });

  }

  pdfCallbackFn(pdf: any) {
    // example to add page number as footer to every page of pdf
    const noOfPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= noOfPages; i++) {
      pdf.setPage(i);
      pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 100, pdf.internal.pageSize.getHeight() - 30);
    }
  }
  exportAs(type: SupportedExtensions, opt?: string) {
    this.config.type = type;
    if (opt) {
      this.config.options.jsPDF.orientation = opt;
    }
    this.exportAsService.save(this.config, 'myFile').subscribe(() => {
      // save started
    });
    this.exportAsService.get(this.config).subscribe(content => {
      const link = document.createElement('a');
      const fileName = 'export.pdf';

      link.href = content;
      link.download = fileName;
      link.click();
      console.log(content);
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
    this.dataService.loadOrganisationUnits(params).subscribe( (OURegion: any) => {
      this.regions = OURegion.organisationUnits;
    });
  }
  getOrgUnitDistrict(){
    this.loadingRegionData = false;
    const params: string[] = ['fields=id,name&filter=level:eq:' + this.dataStore.orgUnitLevel[0].district];
    this.dataService.loadOrganisationUnits(params).subscribe( (DistrictData: any) => {
      this.districts = DistrictData.organisationUnits;
    });
  }
  getOrgUnitFacility(){
    this.loadingRegionData = false;
    const params: string[] = ['fields=id,name&filter=level:eq:' + this.dataStore.orgUnitLevel[0].facility];
    this.dataService.loadOrganisationUnits(params).subscribe( (facilityData: any) => {
      this.facilities = facilityData.organisationUnits;
    });
  }
  getOrgUnitChw(){
    this.loadingRegionData = false;
    const params: string[] = ['fields=id,name&filter=level:eq:' + this.dataStore.orgUnitLevel[0].facility];
    this.dataService.loadOrganisationUnits(params).subscribe( (chwData: any) => {
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

  getColor(target: number, value: number, achieved: number, notInTrack: number): string {
    return this.dataService.getColor(target, value, achieved, notInTrack);
  }
  getDataByOrgUnit(level: string, orgUnitId) {
    const dx = this.getDimensionDx();
    this.orgUnitDataColors.splice(0, this.orgUnitDataColors.length);
    this.orgUnitDataValues = [];
    this.orgUnitHeaders = [];
    if (dx !== null){
      this.dataService.getDataByPeriodFilter(orgUnitId, dx, level).subscribe( (data: any) => {
        const rows = data.rows;
        const headers = data.headers;
        for (let i = 0; i < rows.length; i++){
          const columns = rows[i];
          let count = 0;
          const columnData: string[] = [];
          const colors = [];
          let id = '';
          for (let j = 0; j < columns.length; j++){
              id = columns[0];
              if (headers[j].column === 'dataid'){
              columnData[count] = this.elementName[columns[j]];
              this.orgUnitHeaders[count] = 'Indicators';
              colors[count] = '';
              count++;
            }
            else if (headers[j].column !== 'datacode' && headers[j].column !== 'datadescription' && headers[j].column !== 'dataname'){
              columnData[count] = columns[j];
              this.orgUnitHeaders[count] = headers[j].column;
              colors[count] = this.getColor(parseFloat(this.targetInfo[id + '.target']),
                parseFloat(columnData[count]),
                parseFloat(this.targetInfo[id + '.achieved']),
                parseFloat(this.targetInfo[id + '.notInTrack']));
              count ++;
            }
          }
          this.orgUnitDataColors[i] = colors;
          this.orgUnitDataValues.push(columnData);
        }
      });
      this.getDataByPeriod(orgUnitId);
    }
  }

  getDataByPeriod(orgUnitId) {
    const dx = this.getDimensionDx();
    this.periodDataColors.splice(0, this.periodDataColors.length);
    this.periodDataValues = [];
    this.periodHeaders = [];
    if (dx !== null){
      this.dataService.getDataByOrgUnitFilter(orgUnitId, dx).subscribe((data: any) => {
        const rows = data.rows;
        const headers = data.headers;
        for (let i = 0; i < rows.length; i++) {
          const columns = rows[i];
          let count = 0;
          let id = '';
          const colors = [];
          const columnData: string[] = [];
          for (let j = 0; j < columns.length; j++) {
            if (headers[j].column === 'dataid') {
              columnData[count] = this.elementName[columns[j]];
              id = columns[j];
              this.periodHeaders[count] = 'Indicators';
              colors[count] = '';
              count++;
            } else if (headers[j].column !== 'datacode' && headers[j].column !== 'datadescription' && headers[j].column !== 'dataname') {
              columnData[count] = columns[j];
              this.periodHeaders[count] = headers[j].column;
              colors[count] = this.getColor(parseFloat(this.targetInfo[id + '.target']),
                parseFloat(columnData[count]),
                parseFloat(this.targetInfo[id + '.achieved']),
                parseFloat(this.targetInfo[id + '.notInTrack']));
              count++;
            }
          }
          this.periodDataColors[i] = colors;
          this.periodDataValues.push(columnData);
        }
      });
    }
  }

  getFacilityData() {
    if (this.selectedFacility) {
      this.getDataByOrgUnit(this.dataStore.orgUnitLevel[0].chw, this.selectedFacility);
      this.facilities.forEach(facility => {
        if (facility.id === this.selectedFacility){
          this.selectedFacilityName = facility.name;
        }
      });
    }
  }

  getRegionData() {
    if (this.selectedRegion) {
      this.getDataByOrgUnit(this.dataStore.orgUnitLevel[0].district, this.selectedRegion);
      this.regions.forEach(region => {
        if (region.id === this.selectedRegion){
          this.selectedRegionName = region.name;
        }
      });
    }
  }

  getDistrictData() {
    if (this.selectedDistrict) {
      this.getDataByOrgUnit(this.dataStore.orgUnitLevel[0].facility, this.selectedDistrict);
      this.districts.forEach(district => {
        if (district.id === this.selectedDistrict){
          this.selectedRegionName = district.name;
        }
      });
    }
  }

}
