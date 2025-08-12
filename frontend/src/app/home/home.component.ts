import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header';

@Component({
  selector: 'home-page',
  imports: [RouterOutlet, Header],
  templateUrl: './home.html',
  styleUrl: '../app.css'
})

export class HomePage {
  protected title = 'CF17';
}
