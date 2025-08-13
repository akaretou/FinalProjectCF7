import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user = signal<User | null>(null);
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {

    const formData = {
        username: username,
        password: password
    };

    return this.http.post<User>('http://localhost:3000/login', formData, { withCredentials: true }).pipe(
      tap(user => this.user.set(user)),
      catchError(() => {
        this.user.set(null);
        return of(null);
      })
    );   
  }

  logout() {
    this.user.set(null)
    return this.http.get('http://localhost:3000/logout', { withCredentials: true }).pipe(
      tap(),
      catchError(() => {
        this.user.set(null);
        return of(null);
      })
    );
  }

  isLoggedIn() {
    return this.user() !== null;
  }
}
