import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  
  @Output() loggedIn = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.errorMessage = null;
      const { username, password } = this.loginForm.value;
      this.authService.login({ username: username!, password: password! }).subscribe({
        next: () => {
          this.loggedIn.emit();
          this.router.navigate(['/projects']);
        },
        error: (err) => {
          this.errorMessage = 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
          console.error(err);
        }
      });
    }
  }
}