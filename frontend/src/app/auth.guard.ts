import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

export const AuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return auth.getUser().pipe(
      map(user => {
        if (user) return true;
        router.navigate(['/login']);
        return false;
      })
    );
  }
  
  return true;
};

