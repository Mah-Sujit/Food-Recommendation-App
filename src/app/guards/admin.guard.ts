import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiAuthService } from '../services/auth-service';

export function adminGuard() {
  const auth = inject(ApiAuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn() || !auth.isAdmin()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
}
