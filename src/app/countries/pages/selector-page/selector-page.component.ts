import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { Country } from '../../interfaces/countries.interface';
import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {
  myForm: FormGroup = this.formBuilder.group({
    region: ['', Validators.required],
    country: ['', Validators.required]
  })
  regions: string[] = [];
  countries: Country[] = [];

  constructor(private formBuilder: FormBuilder, private countriesService: CountriesService) { }

  ngOnInit(): void {
    this.regions = this.countriesService.regions;
    
    this.myForm.get('region')?.valueChanges.pipe(
      tap(() => {
        this.myForm.get('country')?.reset('');
      }),
      switchMap(country => this.countriesService.getCountriesByRegion(country))
    ).subscribe({
      next: (countries: Country[]) => {
        this.countries = countries
      }
    })
  }

  save(): void {}

}
