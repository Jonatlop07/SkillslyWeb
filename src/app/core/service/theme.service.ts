import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly is_dark_theme: BehaviorSubject<boolean>;

  constructor() {
    this.is_dark_theme = new BehaviorSubject<boolean>(
      localStorage.getItem('is_dark_theme') === 'true'
    );
  }

  setDarkTheme(is_dark_theme: boolean) {
    this.is_dark_theme.next(is_dark_theme);
    localStorage.setItem('is_dark_theme', this.is_dark_theme.value.toString());
  }

  getDarkTheme(): Observable<boolean> {
    return this.is_dark_theme;
  }
}
