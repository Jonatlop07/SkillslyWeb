import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  public searchForm: Boolean = false;

  constructor(private authService:AuthService, private router:Router, private activatedRoute: ActivatedRoute) { }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  showSearchForm(){
    if(!this.searchForm){
      this.searchForm = true;
    } else {
      this.searchForm = false;
    }
  }

  searchUser(searchInput: string){
    searchInput = searchInput.trim();
    if (!searchInput){
      this.searchForm = false;
      return;
    }
    this.router.navigate(['./search',searchInput], {relativeTo: this.activatedRoute });
  }

}
