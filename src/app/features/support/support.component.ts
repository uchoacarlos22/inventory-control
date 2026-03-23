import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

interface FaqItem {
  id: number;
  questionKey: string;
  answerKey: string;
  open: boolean;
}

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, InputTextarea, FormsModule, TranslateModule],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent {
  contactForm = {
    subject: '',
    message: ''
  };

  faqItems: FaqItem[] = [
    { id: 1, questionKey: 'SUPPORT.FAQ.Q1', answerKey: 'SUPPORT.FAQ.A1', open: false },
    { id: 2, questionKey: 'SUPPORT.FAQ.Q2', answerKey: 'SUPPORT.FAQ.A2', open: false },
    { id: 3, questionKey: 'SUPPORT.FAQ.Q3', answerKey: 'SUPPORT.FAQ.A3', open: false },
    { id: 4, questionKey: 'SUPPORT.FAQ.Q4', answerKey: 'SUPPORT.FAQ.A4', open: false },
  ];

  toggleFaq(id: number): void {
    this.faqItems = this.faqItems.map(item =>
      item.id === id ? { ...item, open: !item.open } : item
    );
  }

  sendMessage() {
    console.log('Support message sent:', this.contactForm);
    this.contactForm = { subject: '', message: '' };
  }
}
