import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';

  constructor() { }

  setTheme(theme: 'light' | 'dark') {
    localStorage.setItem(this.THEME_KEY, theme);
    document.body.classList.toggle('dark-theme', theme === 'dark');
  }

  loadTheme() {
    const savedTheme = (localStorage.getItem(this.THEME_KEY) as 'light' | 'dark') || 'light';
    this.setTheme(savedTheme);
  }

  toggleTheme() {
    const currentTheme = (localStorage.getItem(this.THEME_KEY) as 'light' | 'dark') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  getCurrentTheme(): 'light' | 'dark' {
    return (localStorage.getItem(this.THEME_KEY) as 'light' | 'dark') || 'light';
  }
}
