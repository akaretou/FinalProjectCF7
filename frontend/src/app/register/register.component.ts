import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header';
import { FormsModule } from '@angular/forms';
import { RegisterForm } from './registerForm.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'register-page',
  imports: [RouterOutlet, Header, FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterPage {
  protected title = 'Register Page';
  model = new RegisterForm('', '', '');

  passwordsMatch(): boolean {
    return this.model.password === this.model.password2;
  }

  validEmail(): boolean {
    return !!this.model.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  }

  submit() {
    if (!this.passwordsMatch()) {
      alert('Οι κωδικοί δεν ταιριάζουν.');
      return;
    }

    const formData = {
      firstname: this.model.firstname,
      lastname: this.model.lastname,
      email: this.model.email,
      mobile: this.model.mobile,
      password: this.model.password,
    };

    fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Registration failed');
        return res.json();
      })
      .then((data) => {
        console.log('Success:', data);
        // redirect or notify user
      })
      .catch((err) => {
        console.error('Error:', err);
        alert('Η εγγραφή απέτυχε.');
      });
  }
}
