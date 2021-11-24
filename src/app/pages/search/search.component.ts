import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { SearchUserForm } from '../../interfaces/search_users_response.interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public searchInput: string;
  public findedUsers: SearchUserForm[];

  constructor(private activatedRoute: ActivatedRoute, private searchService: SearchService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params => {
      this.searchInput = params.searchInput;
      const searchUserForm: SearchUserForm = {
        email : this.searchInput,
        name: this.searchInput,
      };
      const searchServiceResponse = this.searchService.searchUser(searchUserForm);
      searchServiceResponse.subscribe((resp:any) => this.findedUsers=resp.users );
    });
  }
}
