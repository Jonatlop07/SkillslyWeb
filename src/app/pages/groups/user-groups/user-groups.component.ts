import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupPresenter } from 'src/app/interfaces/presenter/group/groups.presenter';
import { GroupsService } from 'src/app/services/groups.service';

@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.css'],
})
export class UserGroupsComponent implements OnInit {
  public groups: Array<GroupPresenter> = [];
  public display = false;
  public limit: number;
  public offset: number;
  constructor(private groupsService: GroupsService, private router:Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.limit = 8;
    this.offset = 0;
    this.groupsService
      .queryUserGroups({
        user_id: this.groupsService.getUserId(),
        limit: this.limit,
        offset: this.offset,
      })
      .subscribe((res: any) => {
        this.groups = res.groups;
        this.offset = this.offset + this.limit;
      });
  }

  showDialog() {
    this.display = !this.display;
  }

  onToggleCreate(group: GroupPresenter) {
    this.groups.push(group);
    this.showDialog();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const pos =
      (document.documentElement.scrollTop || document.body.scrollTop) + 1300;
    const max =
      document.documentElement.scrollHeight || document.body.scrollHeight;
    if (pos > max) {
      if (!this.groupsService.isChargingGroups) {
        const groupServiceResponse = this.groupsService.queryUserGroups({
          user_id: this.groupsService.getUserId(),
          limit: this.limit,
          offset: this.offset,
        });
        groupServiceResponse.subscribe((resp: any) => {
          this.groups.push(...resp.groups);
          this.offset = this.offset + this.limit;
        });
      }
    }
  }

  getGroup(group_id: string){
    this.router.navigate(['main/group', group_id]);
  }
}
