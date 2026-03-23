import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthFacadeService } from '../../state/auth-facade.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, PasswordModule, DividerModule, ButtonModule, MessageModule, TranslateModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  public authFacade = inject(AuthFacadeService);

  loginForm = this.fb.group({
    email: ['mor_2314', [Validators.required]],
    password: ['83r5^_', Validators.required]
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      // Mapeia o campo 'email' da UI para o campo 'username' esperado pela FakeStoreAPI
      this.authFacade.login({ username: email, password });
    }
  }
}

