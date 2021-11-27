import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { SearchUserResponse } from '../../interfaces/search_users_response.interface';
import * as moment from 'moment';
import { SearchUserInputForm } from 'src/app/interfaces/search_users_input_form.interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public searchInput: string;
  public foundUsers: SearchUserResponse[];

  constructor(private activatedRoute: ActivatedRoute, private searchService: SearchService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params => {
      this.searchInput = params.searchInput; 
      const searchUserForm: SearchUserInputForm = {
        email: this.searchInput, 
        name: this.searchInput
      }
      const searchServiceResponse = this.searchService.searchUser(searchUserForm);
      searchServiceResponse.subscribe( (resp: any) => {
        this.foundUsers = resp.users;
        this.foundUsers.forEach( (user: any) => {
          const date_of_birth = new Date(user.date_of_birth);
          user.date_of_birth = moment(date_of_birth).locale('es').format('dddd DD MMMM - YYYY')
        })   
      })
    }) 
  }
}

