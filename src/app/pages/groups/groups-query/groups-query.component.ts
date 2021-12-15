import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupPresenter } from 'src/app/interfaces/presenter/group/groups.presenter';
import { GroupsService } from 'src/app/services/groups.service';

@Component({
  selector: 'app-groups-query',
  templateUrl: './groups-query.component.html',
  styleUrls: ['./groups-query.component.css'],
})
export class GroupsQueryComponent implements OnInit {

  public no_groups = false;
  public limit: number;
  public offset: number;
  public categories = [
    { name: 'Desarrollo de software', value: 'Development', img: 'mdi-desktop-mac', color: 'bg-cyan'},
    { name: 'Criptografia', value: 'Cripto', img: 'mdi-lock-outline', color: 'bg-success' },
    { name: 'Diseño', value: 'Graphic Design', img: 'mdi-pen', color: 'bg-warning' },
    { name: 'Arte', value: 'Arts', img: 'mdi-brush', color: 'bg-danger' },
    { name: 'Astronomia', value: 'Astronomy', img: 'mdi-star-outline', color: 'bg-info' },
    { name: 'Investigacion', value: 'Research', img: 'mdi-book', color: 'bg-dark' },
  ];
  public groups: Array<GroupPresenter> = [];
  constructor(private groupsService: GroupsService, private router: Router) {}

  ngOnInit(): void {}

  searchGroup(groupName: string) {
    groupName = groupName.trim();
    if (!groupName) {
      return;
    }
    this.limit = 5;
    this.offset = 0;
    this.groupsService
      .queryUserGroups({
        name: groupName,
        limit: this.limit,
        offset: this.offset,
      })
      .subscribe((res: any) => {
        this.groups = res.groups;
        this.offset = this.offset + this.limit;
        this.no_groups = this.groups.length > 0 ? false : true;
      });
  }

  searchGroups(categoryName: string) {
    this.limit = 8;
    this.offset = 0;
    this.groupsService
      .queryUserGroups({
        category: categoryName,
        limit: this.limit,
        offset: this.offset,
      })
      .subscribe((res: any) => {
        this.groups = res.groups;
        this.offset = this.offset + this.limit;
        this.no_groups = this.groups.length > 0 ? false : true;
      });
  }

  getGroup(group_id: string){
    this.router.navigate(['main/group', group_id]);
  }

}
