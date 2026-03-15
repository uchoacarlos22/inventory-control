import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, AccordionModule, ButtonModule, InputTextModule, InputTextarea, FormsModule, TranslateModule],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent {
  contactForm = {
    subject: '',
    message: ''
  };

  sendMessage() {
    console.log('Support message sent:', this.contactForm);
    this.contactForm = { subject: '', message: '' };
    // Mudar para exibir toast de sucesso na versão final
  }
}
