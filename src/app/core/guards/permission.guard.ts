import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredPermissions = (route.data['permissions'] as string[] | undefined) ?? [];

  if (requiredPermissions.length === 0 || authService.hasAnyPermission(requiredPermissions)) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
