import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Country {
  name: string;
  capital: string;
  population: number;
  continent: string;
  flag?: string;
}

// V1 - Hardcoded data
export const COUNTRIES: Country[] = [
  { name: 'France', capital: 'Paris', population: 67000000, continent: 'Europe' },
  { name: 'Japan', capital: 'Tokyo', population: 125000000, continent: 'Asie' },
  { name: 'Brazil', capital: 'Brasília', population: 213000000, continent: 'Amériques' },
];

@Component({
  selector: 'app-countries-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './countries-list.component.html',
  styleUrl: './countries-list.component.scss'
})
export class CountriesListComponent implements OnInit {
  countries: Country[] = [];
  filteredCountries: Country[] = [];
  loading = false;
  private readonly apiUrl = `${environment.apiBase}`;
  useAPI = false;

  // Filtres et tri
  searchTerm = '';
  selectedContinent = '';
  sortBy = 'name';
  sortOrder = 'asc';

  continents: string[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadCountries();
  }

  loadCountries() {
    if (this.useAPI) {
      this.loadFromAPI();
    } else {
      this.loadHardcodedData();
    }
  }

  loadHardcodedData() {
    this.countries = COUNTRIES;
    this.updateContinents();
    this.applyFiltersAndSort();
  }

  loadFromAPI() {
    this.loading = true;
    this.http.get<any[]>(`${this.apiUrl}/all?fields=name,capital,population,region,flags`)
      .subscribe({
        next: (data) => {
          this.countries = data.map(country => ({
            name: country.name.common,
            capital: country.capital?.[0] || 'N/A',
            population: country.population,
            continent: country.region || 'N/A',
            flag: country.flags?.svg
          }));
          this.updateContinents();
          this.applyFiltersAndSort();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading countries:', error);
          this.loadHardcodedData();
          this.loading = false;
        }
      });
  }

  toggleDataSource() {
    this.useAPI = !this.useAPI;
    this.loadCountries();
  }

  updateContinents() {
    this.continents = [...new Set(this.countries.map(c => c.continent))].sort();
  }

  applyFiltersAndSort() {
    let filtered = [...this.countries];

    // Filtrer par nom
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(country =>
        country.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filtrer par continent
    if (this.selectedContinent) {
      filtered = filtered.filter(country => country.continent === this.selectedContinent);
    }

    // Trier
    filtered.sort((a, b) => {
      let valueA: any, valueB: any;

      switch (this.sortBy) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'population':
          valueA = a.population;
          valueB = b.population;
          break;
        case 'continent':
          valueA = a.continent.toLowerCase();
          valueB = b.continent.toLowerCase();
          break;
        default:
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
      }

      if (valueA < valueB) return this.sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredCountries = filtered;
  }

  onSearchChange() {
    this.applyFiltersAndSort();
  }

  onContinentChange() {
    this.applyFiltersAndSort();
  }

  onSortChange() {
    this.applyFiltersAndSort();
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFiltersAndSort();
  }
}