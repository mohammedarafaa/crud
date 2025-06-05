import { Component, inject, signal, WritableSignal, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Countries } from '../../models/countries';
import { Cities } from '../../models/cities';
import { Disrticts } from '../../models/disrticts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @ViewChild('countryModal') countryModal!: ElementRef<HTMLDialogElement>;
  @ViewChild('cityModal') cityModal!: ElementRef<HTMLDialogElement>;
  @ViewChild('districtModal') districtModal!: ElementRef<HTMLDialogElement>;
  @ViewChild('editCountryModal') editCountryModal!: ElementRef<HTMLDialogElement>;
  @ViewChild('editCityModal') editCityModal!: ElementRef<HTMLDialogElement>;
  @ViewChild('editDistrictModal') editDistrictModal!: ElementRef<HTMLDialogElement>;

  countriesform!: FormGroup;
  citiesform!: FormGroup;
  districtform!: FormGroup;
  editCountryForm!: FormGroup;
  editCityForm!: FormGroup;
  editDistrictForm!: FormGroup;

  countries: WritableSignal<Countries[]> = signal([]);
  cities: WritableSignal<Cities[]> = signal([]);
  districts: WritableSignal<Disrticts[]> = signal([]);

  private currentEditCountryIndex: number = -1;
  private currentEditCityIndex: number = -1;
  private currentEditDistrictIndex: number = -1;

  countryError: string = '';
  cityError: string = '';
  districtError: string = '';
  editCountryError: string = '';
  editCityError: string = '';
  editDistrictError: string = '';

  private readonly formBuilderService = inject(FormBuilder);

  ngOnInit(): void {
    this.initializeForms();
    this.loadFromLocalStorage();
  }

  private initializeForms(): void {
    this.countriesform = this.formBuilderService.group({
      name: [null, [Validators.required, Validators.minLength(2)]],
      code: [null, [Validators.required, Validators.pattern(/^[0-9]*$/)]]
    });

    this.citiesform = this.formBuilderService.group({
      name: [null, [Validators.required, Validators.minLength(2)]],
      country: [null, Validators.required]
    });

    this.districtform = this.formBuilderService.group({
      name: [null, [Validators.required, Validators.minLength(2)]],
      city: [null, Validators.required]
    });

    this.editCountryForm = this.formBuilderService.group({
      name: [null, [Validators.required, Validators.minLength(2)]],
      code: [null, [Validators.required, Validators.pattern(/^[0-9]*$/)]]
    });

    this.editCityForm = this.formBuilderService.group({
      name: [null, [Validators.required, Validators.minLength(2)]],
      country: [null, Validators.required]
    });

    this.editDistrictForm = this.formBuilderService.group({
      name: [null, [Validators.required, Validators.minLength(2)]],
      city: [null, Validators.required]
    });
  }

  private loadFromLocalStorage(): void {
    if (localStorage.getItem('countries')) {
      this.countries.set(JSON.parse(localStorage.getItem('countries')!));
    }
    if (localStorage.getItem('cities')) {
      this.cities.set(JSON.parse(localStorage.getItem('cities')!));
    }
    if (localStorage.getItem('districts')) {
      this.districts.set(JSON.parse(localStorage.getItem('districts')!));
    }
  }

  addCountry(): void {
    this.countryError = '';
    this.countriesform.markAllAsTouched();

    if (this.countriesform.invalid) {
      this.countryError = 'Please fill all required fields correctly';
      return;
    }

    const newCountry = this.countriesform.value;
    const exists = this.countries().some(c =>
      c.name.toLowerCase() === newCountry.name.toLowerCase() ||
      c.code.toString() === newCountry.code.toString()
    );

    if (exists) {
      this.countryError = 'Country with this name or code already exists';
      return;
    }

    this.countries.update(countries => [...countries, newCountry]);
    this.saveToLocalStorage('countries', this.countries());
    this.countriesform.reset();
    this.countryModal.nativeElement.close();
  }

  addCity(): void {
    this.cityError = '';
    this.citiesform.markAllAsTouched();

    if (this.citiesform.invalid) {
      this.cityError = 'Please fill all required fields correctly';
      return;
    }

    const newCity = this.citiesform.value;
    const exists = this.cities().some(c =>
      c.name.toLowerCase() === newCity.name.toLowerCase() &&
      c.country === newCity.country
    );

    if (exists) {
      this.cityError = 'City with this name already exists in the selected country';
      return;
    }

    this.cities.update(cities => [...cities, newCity]);
    this.saveToLocalStorage('cities', this.cities());
    this.citiesform.reset();
    this.cityModal.nativeElement.close();
  }

  addDistrict(): void {
    this.districtError = '';
    this.districtform.markAllAsTouched();

    if (this.districtform.invalid) {
      this.districtError = 'Please fill all required fields correctly';
      return;
    }

    const newDistrict = this.districtform.value;
    const exists = this.districts().some(d =>
      d.name.toLowerCase() === newDistrict.name.toLowerCase() &&
      d.city === newDistrict.city
    );

    if (exists) {
      this.districtError = 'District with this name already exists in the selected city';
      return;
    }

    this.districts.update(districts => [...districts, newDistrict]);
    this.saveToLocalStorage('districts', this.districts());
    this.districtform.reset();
    this.districtModal.nativeElement.close();
  }

  deleteCountry(index: number): void {
    const countryToDelete = this.countries()[index];
    const dependentCities = this.cities().filter(c => c.country === countryToDelete.name);
    if (dependentCities.length > 0) {
      this.cities.update(cities => cities.filter(c => c.country !== countryToDelete.name));
      this.saveToLocalStorage('cities', this.cities());
      const cityNames = dependentCities.map(c => c.name);
      this.districts.update(districts => districts.filter(d => !cityNames.includes(d.city)));
      this.saveToLocalStorage('districts', this.districts());
    }
    this.countries.update(countries => countries.filter((_, i) => i !== index));
    this.saveToLocalStorage('countries', this.countries());
  }

  deleteCity(index: number): void {
    const cityToDelete = this.cities()[index];
    const dependentDistricts = this.districts().filter(d => d.city === cityToDelete.name);
    if (dependentDistricts.length > 0) {
      this.districts.update(districts => districts.filter(d => d.city !== cityToDelete.name));
      this.saveToLocalStorage('districts', this.districts());
    }
    this.cities.update(cities => cities.filter((_, i) => i !== index));
    this.saveToLocalStorage('cities', this.cities());
  }

  deleteDistric(index: number): void {
    this.districts.update(districts => districts.filter((_, i) => i !== index));
    this.saveToLocalStorage('districts', this.districts());
  }

  openEditCountryModal(country: Countries, index: number): void {
    this.currentEditCountryIndex = index;
    this.editCountryForm.patchValue({
      name: country.name,
      code: country.code
    });
    this.editCountryError = '';
    this.editCountryModal.nativeElement.showModal();
  }

  openEditCityModal(city: Cities, index: number): void {
    this.currentEditCityIndex = index;
    this.editCityForm.patchValue({
      name: city.name,
      country: city.country
    });
    this.editCityError = '';
    this.editCityModal.nativeElement.showModal();
  }

  openEditDistrictModal(district: Disrticts, index: number): void {
    this.currentEditDistrictIndex = index;
    this.editDistrictForm.patchValue({
      name: district.name,
      city: district.city
    });
    this.editDistrictError = '';
    this.editDistrictModal.nativeElement.showModal();
  }

  updateCountry(): void {
    this.editCountryError = '';
    this.editCountryForm.markAllAsTouched();

    if (this.editCountryForm.invalid) {
      this.editCountryError = 'Please fill all required fields correctly';
      return;
    }

    const updatedCountry = this.editCountryForm.value;
    const currentCountry = this.countries()[this.currentEditCountryIndex];

    const exists = this.countries().some((c, i) =>
      i !== this.currentEditCountryIndex &&
      (c.name.toLowerCase() === updatedCountry.name.toLowerCase() ||
        c.code.toString() === updatedCountry.code.toString())
    );

    if (exists) {
      this.editCountryError = 'Another country with this name or code already exists';
      return;
    }

    this.countries.update(countries => {
      countries[this.currentEditCountryIndex] = updatedCountry;
      return [...countries];
    });

    if (currentCountry.name !== updatedCountry.name) {
      this.cities.update(cities => {
        return cities.map(city => {
          if (city.country === currentCountry.name) {
            return { ...city, country: updatedCountry.name };
          }
          return city;
        });
      });
      this.saveToLocalStorage('cities', this.cities());
    }

    this.saveToLocalStorage('countries', this.countries());
    this.editCountryModal.nativeElement.close();
  }

  updateCity(): void {
    this.editCityError = '';
    this.editCityForm.markAllAsTouched();

    if (this.editCityForm.invalid) {
      this.editCityError = 'Please fill all required fields correctly';
      return;
    }

    const updatedCity = this.editCityForm.value;
    const currentCity = this.cities()[this.currentEditCityIndex];

    const exists = this.cities().some((c, i) =>
      i !== this.currentEditCityIndex &&
      c.name.toLowerCase() === updatedCity.name.toLowerCase() &&
      c.country === updatedCity.country
    );

    if (exists) {
      this.editCityError = 'Another city with this name already exists in the selected country';
      return;
    }

    this.cities.update(cities => {
      cities[this.currentEditCityIndex] = updatedCity;
      return [...cities];
    });

    if (currentCity.name !== updatedCity.name) {
      this.districts.update(districts => {
        return districts.map(district => {
          if (district.city === currentCity.name) {
            return { ...district, city: updatedCity.name };
          }
          return district;
        });
      });
      this.saveToLocalStorage('districts', this.districts());
    }

    this.saveToLocalStorage('cities', this.cities());
    this.editCityModal.nativeElement.close();
  }

  updateDistrict(): void {
    this.editDistrictError = '';
    this.editDistrictForm.markAllAsTouched();

    if (this.editDistrictForm.invalid) {
      this.editDistrictError = 'Please fill all required fields correctly';
      return;
    }

    const updatedDistrict = this.editDistrictForm.value;

    const exists = this.districts().some((d, i) =>
      i !== this.currentEditDistrictIndex &&
      d.name.toLowerCase() === updatedDistrict.name.toLowerCase() &&
      d.city === updatedDistrict.city
    );

    if (exists) {
      this.editDistrictError = 'Another district with this name already exists in the selected city';
      return;
    }

    this.districts.update(districts => {
      districts[this.currentEditDistrictIndex] = updatedDistrict;
      return [...districts];
    });
    this.saveToLocalStorage('districts', this.districts());
    this.editDistrictModal.nativeElement.close();
  }

  private saveToLocalStorage(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  isFieldInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
