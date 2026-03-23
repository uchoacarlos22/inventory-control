import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, MessageModule, TranslateModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loading = false;
  success = false;

  registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  getPasswordStrength(): { label: string; colorClass: string; percentage: number } {
    const password = this.registerForm.get('password')?.value || '';
    if (password.length === 0) return { label: '', colorClass: '', percentage: 0 };
    if (password.length < 4) return { label: 'REGISTER.STRENGTH.WEAK', colorClass: 'bg-red-500', percentage: 25 };
    if (password.length < 6) return { label: 'REGISTER.STRENGTH.FAIR', colorClass: 'bg-orange-500', percentage: 50 };
    if (password.length < 8) return { label: 'REGISTER.STRENGTH.GOOD', colorClass: 'bg-yellow-500', percentage: 75 };
    return { label: 'REGISTER.STRENGTH.STRONG', colorClass: 'bg-green-500', percentage: 100 };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      // Simulate registration (mock)
      setTimeout(() => {
        this.loading = false;
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }, 1500);
    }
  }
}
