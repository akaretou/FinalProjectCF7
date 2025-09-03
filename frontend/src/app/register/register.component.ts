import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from '../header';
import { FormsModule } from '@angular/forms';
import { RegisterForm } from './registerForm.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'register-page',
  imports: [RouterOutlet, Header, FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterPage {
  protected title = 'Register Page';
  constructor(private auth: AuthService, private router: Router) { }

  model = new RegisterForm('', '', '');

  passwordsMatch(): boolean {
    return this.model.password === this.model.password2;
  }

  validEmail(): boolean {
    return !!this.model.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  }

  error = ""
  firstname = ""
  lastname = ""
  email = ""
  mobile = ""
  password = ""
  password2 = ""
  

  submit() {
    this.auth.register(this.firstname, this.lastname, this.email, this.mobile, this.password).subscribe({
      next: () =>  this.router.navigate(['/login']),
      error: () => this.error = 'Η εγγραφή απέτυχε'
    });
  }
}
