import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service'
import { auth_routing_paths } from '../../features/authentication/auth.routing'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){}

  canActivate(): boolean  {
    if (!this.authService.isUserAuthenticated()) {
      this.router.navigateByUrl(`${auth_routing_paths.auth}/${auth_routing_paths.sign_in}`);
      return false;
    }
    return true;
  }
}
