import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from '../header';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'login-page',
  imports: [RouterOutlet, Header, FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginPage {
  protected title = 'Login Page';

  error = ""
  email = ""
  password = ""
  constructor(private auth: AuthService, private router: Router) { }

  submit() {
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => (this.error = 'Login failed')
    });
  }
}
