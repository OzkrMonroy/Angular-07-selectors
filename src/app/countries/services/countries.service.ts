import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../interfaces/countries.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private _baseURL = 'https://restcountries.com/v3.1';

  private _regions: string[] = [ 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regions(): string[]{
    return [...this._regions]
  }

  constructor(private http: HttpClient) { }

  getCountriesByRegion(region: string): Observable<Country[]> {
    return this.http.get<Country[]>(`${this._baseURL}/region/${region}?fields=name,cca3`)
  }
}
