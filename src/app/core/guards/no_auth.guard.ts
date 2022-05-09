import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service'
import { feed_routing_paths } from '../../features/feed/feed.routing'

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){}

  canActivate(): boolean  {
    if (this.authService.isUserAuthenticated()) {
      this.router.navigateByUrl(`${feed_routing_paths.feed}`);
      return false;
    }
    return true;
  }
}
