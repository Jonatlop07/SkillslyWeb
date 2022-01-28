import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { GroupPresenter } from 'src/app/interfaces/group/groups.presenter';
import GroupUser from 'src/app/interfaces/group/group_user.interface';
import { PermanentPostPresenter } from 'src/app/interfaces/post/query_post.presenter';
import { PostModel } from 'src/app/models/post_collection.model';
import { GroupsService } from 'src/app/services/groups.service';
import { PostService } from 'src/app/services/posts.service';

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
  public posts: Array<PostModel> = [];
  public display = false;
  public display_create = false;
  public limit: number;
  public offset: number;
  public only_owner_error = false;
  constructor(
    private groupsService: GroupsService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private postsService: PostService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.searchedGroup = params['groupId'];
      this.groupsService
        .queryGroup({ group_id: this.searchedGroup })
        .subscribe((res: any) => {
          this.group = res;
          if (this.group.isMember) {
            this.loadPosts();
          }
        });
    });
  }

  public showGroupUsers() {
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

  public onRemoveUser(event: Event, user_id: string, index: number) {
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
            this.users.splice(index, 1);
          });
      },
      reject: () => {
        return;
      },
    });
  }

  public isOwnerAndNotSelf(user_id: string) {
    return !(this.groupsService.getUserId() === user_id) && this.group.isOwner;
  }

  public joinGroup() {
    this.groupsService.joinGroup(this.group.id).subscribe(() => {
      this.group.existsRequest = true;
    });
  }

  public cancelGroupRequest() {
    this.groupsService.removeJoinRequest(this.group.id).subscribe(() => {
      this.group.existsRequest = false;
    });
  }

  public onLeaveGroup(event: Event) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Estás seguro que deseas abandonar este grupo?',
      icon: 'mdi mdi-emoticon-sad',
      accept: () => {
        this.groupsService.leaveGroup(this.searchedGroup).subscribe(
          () => {
            this.router.navigate(['../../my-groups'], {
              relativeTo: this.route,
            });
          },
          (error) => {
            if (error.status === 401) {
              this.only_owner_error = true;
            }
          }
        );
      },
      reject: () => {
        return;
      },
    });
  }

  public onCloseError() {
    this.only_owner_error = false;
  }

  public loadPosts() {
    this.limit = 3;
    this.offset = 0;
    this.postsService
      .queryPostCollection({
        group_id: this.group.id,
        limit: this.limit,
        offset: this.offset,
      })
      .subscribe((res: any) => {
        this.posts = res.posts;
        this.offset = this.offset + this.limit;
      });
  }

  public onToggleCreate(post: PermanentPostPresenter) {
    this.posts.push(post);
    this.display_create = !this.display_create;
  }

  public onDeletePost(id: string) {
    this.posts.splice(parseInt(id), 1);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const pos =
      (document.documentElement.scrollTop || document.body.scrollTop) + 1300;
    const max =
      document.documentElement.scrollHeight || document.body.scrollHeight;
    if (pos > max) {
      if (!this.postsService.isChargingPosts) {
        this.postsService
          .queryPostCollection({
            group_id: this.group.id,
            limit: this.limit,
            offset: this.offset,
          })
          .subscribe((resp: any) => {
            this.posts.push(...resp.posts);
            this.offset = this.offset + this.limit;
          });
      }
    }
  }
}
