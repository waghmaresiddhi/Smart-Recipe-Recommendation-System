import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  selectedTheme: string = 'light'; // Default theme is light

  changeTheme(theme: string): void {
    this.selectedTheme = theme;
    document.body.className = ''; // Clear any previous theme class
    document.body.classList.add(theme); // Add the selected theme class
  }
}
