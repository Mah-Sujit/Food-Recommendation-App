////guestGuard – blocks login/signup when logged in//

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiAuthService } from '../services/auth-service';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(ApiAuthService);
  const router = inject(Router);

  // If token exists → redirect user away
  if (auth.isLoggedIn()) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
