import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'nav-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './app.css'
})
export class Header {
  constructor(public auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/']),
    })
  }
}