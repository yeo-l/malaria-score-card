import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import * as data from '../malariaDataStore.json';
import * as dataStore from '../data.json';
import {SERVER_API_URL} from '../shared/constants';
import {IMalariaDataStoreModel, MalariaDataStoreModel} from '../models/malaria-data-store-model';
import {Observable} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DataService {
  tData: any = (data as any).default;
  dataStore: any = (dataStore as any).default;
  constructor(private httpClient: HttpClient) {}

  postDataStore(){
    return this.httpClient.post(SERVER_API_URL + '/dataStore/malariaSoreCard/indicator', this.tData);
  }
  upload(){
    return this.httpClient.post(SERVER_API_URL + '/dataStore/malariaSoreCard/indicator', this.dataStore);
  }
  getDataStore(){
    return this.httpClient.get<IMalariaDataStoreModel>(SERVER_API_URL + '/dataStore/malariaSoreCard/indicator');
  }
  load(){
    return this.httpClient.get<any>(SERVER_API_URL + '/dataStore/malariaSoreCard/indicator');
  }
  getOrganisationUnitLevels(){
    return this.httpClient.get(SERVER_API_URL + '/organisationUnitLevels');
  }

  save(dataStore: MalariaDataStoreModel): Observable<Object> {
    return this.httpClient.post(SERVER_API_URL + '/dataStore/malariaSoreCard/indicator', dataStore);
  }

  loadMetaData(metaData: string, params: string[]){
    return this.httpClient.get<[]>(SERVER_API_URL + '/' + metaData + '?paging=false' + (params ? '&' + params.join('&') : ''));
  }

  loadOrganisationUnits(params) {
    return this.loadMetaData('organisationUnits', params);
  }

  loadIndicators(params){
    return this.loadMetaData('indicators', params);
  }

  loadDataElements(params) {
    return this.loadMetaData('dataElements', params);
  }

  update(dataStore: MalariaDataStoreModel) {
    return this.httpClient.put(SERVER_API_URL + '/dataStore/malariaSoreCard/indicator', dataStore);
  }
}
