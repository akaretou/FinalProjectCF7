import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet>`,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'CF7';

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.getUser().subscribe();
  }
}
