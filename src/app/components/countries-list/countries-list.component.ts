import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

export const COUNTRIES = [
  { name: 'France', capital: 'Paris', population: 67000000 },
  { name: 'Japan', capital: 'Tokyo', population: 125000000 },
  { name: 'Brazil', capital: 'Brasília', population: 213000000 },
];

@Component({
  selector: 'app-countries-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.scss']
})
export class CountriesListComponent {
  private readonly apiUrl = `${environment.apiBase}`;

  useApi = false;
  countries: any[] = [];
  filter = '';

  constructor(private http: HttpClient) {
    this.countries = COUNTRIES;
  }

  toggleSource() {
    this.useApi = !this.useApi;
    if (this.useApi) {
      this.loadFromApi();
    } else {
      this.countries = COUNTRIES;
    }
  }

  loadFromApi() {
    let url = `${this.apiUrl}/all?fields=name,capital,population,region,flags`;
    if (this.filter.trim()) {
      url = `${this.apiUrl}/name/${this.filter}?fields=name,capital,population,region,flags`;
    }

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.countries = data.map(c => ({
          flag: c.flags.png,
          name: c.name.common,
          capital: c.capital ? c.capital[0] : 'N/A',
          population: c.population,
          region: c.region
        }));
      },
      error: () => {
        this.countries = [];
      }
    });
  }
}
