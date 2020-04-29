import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class HttpClientService {
  public APIURL = '../../../api/';
  constructor(private http: HttpClient) {}
}
