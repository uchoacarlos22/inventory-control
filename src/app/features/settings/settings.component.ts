import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DividerModule } from 'primeng/divider';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, DropdownModule, InputSwitchModule, DividerModule, TranslateModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  activeTab: 'profile' | 'preferences' | 'security' = 'profile';

  languages = [
    { name: 'English (US)', code: 'en' },
    { name: 'Portuguese (BR)', code: 'pt' },
    { name: 'Spanish', code: 'es' }
  ];
  selectedLanguage = this.languages[0];

  notifications = {
    emailAlerts: true,
    pushNotifications: false,
    weeklyReports: true
  };

  profile = {
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'admin@inventory.pro',
    role: 'Administrator'
  };

  saveChanges() {
    // Simulando salvamento
    console.log('Settings saved:', { profile: this.profile, notifications: this.notifications, language: this.selectedLanguage });
    // Idealmente, usar um MessageService do PrimeNG aqui
  }
}
