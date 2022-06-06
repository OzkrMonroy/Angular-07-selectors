import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of, combineLatest } from 'rxjs';
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
  getCountryByCode(code: string): Observable<Country> {
    return this.http.get<Country>(`${this._baseURL}/alpha/${code}?fields=name,cca3`)
  }
  getBorders(countryCode: string):Observable<Country> {
    if(countryCode === ''){
      return of({} as Country)
    }
    return this.http.get<Country>(`${this._baseURL}/alpha/${countryCode}?fields=borders`)
  }
  getCountriesByCode(borders: string[] | undefined): Observable<Country[]> {
    if(!borders || borders.length < 1){
      return of([])
    }
    const requests: Observable<Country>[] = [];
    borders.forEach(borderCode => {
      const request = this.getCountryByCode(borderCode);
      requests.push(request);
    })

    return combineLatest(requests);
    // return forkJoin(requests);
  }
}
