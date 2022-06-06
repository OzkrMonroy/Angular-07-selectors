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
    country: ['', Validators.required],
    border: ['', Validators.required]
  })
  regions: string[] = [];
  countries: Country[] = [];
  borders: Country[] = []
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder, private countriesService: CountriesService) { }

  ngOnInit(): void {
    this.regions = this.countriesService.regions;
    
    this.myForm.get('region')?.valueChanges.pipe(
      tap(() => {
        this.countries = []
        this.myForm.get('country')?.reset('');
        // this.myForm.get('border')?.disable();
        this.loading = true;
      }),
      switchMap(country => this.countriesService.getCountriesByRegion(country))
    ).subscribe({
      next: (countries: Country[]) => {
        this.countries = countries
        this.loading = false;
      }
    })

    this.myForm.get('country')?.valueChanges.pipe(
      tap(() => {
        this.borders = [];
        this.myForm.get('border')?.reset('');
        this.loading = true;
        // this.myForm.get('border')?.enable();
      }),
      switchMap(country => this.countriesService.getBorders(country)),
      tap( ( country ) => {
        if( !country?.borders || country?.borders.length === 0 ){ 
          // this.loading = false 
          this.myForm.get('border')?.setErrors(null);
        }
      }),
      switchMap(countryB => this.countriesService.getCountriesByCode(countryB.borders))
    ).subscribe({
      next: (borders: Country[]) => {
        this.borders = borders || []
        this.loading = false;
        console.log(borders);
      }
    })
  }

  save(): void {}

}
