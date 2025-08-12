import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from '../header';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  submit() {
    
  }
}
