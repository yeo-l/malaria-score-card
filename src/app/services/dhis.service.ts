import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../shared/constants';

@Injectable({
  providedIn: "root"
})
export class DhisService {
  constructor(private http: HttpClient) {}

}



