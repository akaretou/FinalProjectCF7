import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'register-page',
  imports: [RouterOutlet, Header, FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterPage {
  protected title = 'Register Page';
  
  submit() {
    
  }
}
