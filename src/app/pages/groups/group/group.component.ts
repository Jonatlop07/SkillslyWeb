import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { GroupPresenter } from 'src/app/interfaces/presenter/group/groups.presenter';
import GroupUser from 'src/app/interfaces/presenter/group/group_user.interface';
import { GroupsService } from 'src/app/services/groups.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
  providers: [ConfirmationService],
})
export class GroupComponent implements OnInit {
  public group: GroupPresenter = {
    id: '',
    name: '',
    description: '',
    picture: '',
  };
  public searchedGroup: string;
  public users: Array<GroupUser> = [];
  public display = false;
  public limit: number;
  public offset: number;
  public only_owner_error = false;
  constructor(
    private groupsService: GroupsService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.searchedGroup = params['groupId'];
      this.groupsService
        .queryGroup({ group_id: this.searchedGroup })
        .subscribe((res: any) => {
          this.group = res;
        });
    });
  }

  showGroupUsers() {
    this.limit = 5;
    this.offset = 0;
    this.groupsService
      .queryGroupUsers({
        group_id: this.searchedGroup,
        limit: this.limit,
        offset: this.offset,
      })
      .subscribe((res: any) => {
        this.users = res.groupUsers;
        this.offset = this.offset + this.limit;
      });
    this.display = !this.display;
  }

  confirm(event: Event, user_id: string) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Estás seguro que deseas eliminar este usuario del grupo?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.groupsService
          .removeUser({
            user_id: user_id,
            group_id: this.searchedGroup,
            action: 'remove',
          })
          .subscribe(() => {
            this.router.navigate(['../../../mygroups'], { relativeTo: this.route });
          });
      },
      reject: () => {
        return;
      },
    });
  }

  isOwnerAndNotSelf(user_id: string){
    return !(this.groupsService.getUserId() === user_id) && this.group.isOwner
  }

  joinGroup(){
    this.groupsService.joinGroup(this.group.id).subscribe(
      () => {
        this.group.existsRequest = true;
      }
    )
  }

  cancelGroupRequest(){
    this.groupsService.removeJoinRequest(this.group.id).subscribe(
      () => {
        this.group.existsRequest = false;
      }
    )
  }

  onLeaveGroup(event: Event){
    this.confirmationService.confirm({
      target: event.target,
      message: 'Estás seguro que deseas abandonar este grupo?',
      icon: 'mdi mdi-emoticon-sad',
      accept: () => {
        this.groupsService
          .leaveGroup(this.searchedGroup)
          .subscribe(() => {
            this.router.navigate(['../../mygroups'], { relativeTo: this.route });
          },
          (error) => {
            if (error.status === 401){
              this.only_owner_error = true;
            }
          });
      },
      reject: () => {
        return;
      },
    });
  }

  onCloseError(){
    this.only_owner_error = false;
  }
}
