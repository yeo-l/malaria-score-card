import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// @ts-ignore
import * as data from '../malariaDataStore.json';
import {SERVER_API_URL} from '../shared/constants';
import {IMalariaDataStoreModel} from '../models/malaria-data-store-model';

@Injectable({
  providedIn: "root"
})
export class DataService {
  tdata: any = (data as any).default;
  constructor(private httpClient: HttpClient) {}

  postDataStore(){
    return this.httpClient.post(SERVER_API_URL + '/dataStore/malariaSoreCard/indicator', this.tdata);
  }
  getDataStore(){
    return this.httpClient.get<IMalariaDataStoreModel>(SERVER_API_URL + '/dataStore/malariaSoreCard/indicator');
  }
  getOrganisationUnitLevels(){
    return this.httpClient.get(SERVER_API_URL + '/organisationUnitLevels');
  }


}
