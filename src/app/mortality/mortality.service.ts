import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MortalityPage } from './model/mortalityPage';
import { environment } from 'src/environments/environment';
import { Mortality } from './model/mortality';

const API_ENDPOINT = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class MortalityService {

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get<MortalityPage>(`${API_ENDPOINT}/mortalities`);
  }

  getAllByYear(year: number) {
    return this.httpClient.get<MortalityPage>(`${API_ENDPOINT}/mortalities/${year}`);
  }

  update(mortality: Mortality) {
    return this.httpClient.put<Mortality>(`${API_ENDPOINT}/mortalities/${mortality.id}`, mortality);
  }
}
