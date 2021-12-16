import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { GroupPresenter } from 'src/app/interfaces/presenter/group/groups.presenter';
import JoinRequest from 'src/app/interfaces/presenter/group/join_request.interface';
import { GroupsService } from 'src/app/services/groups.service';

@Component({
  selector: 'app-group-update',
  templateUrl: './group-update.component.html',
  styleUrls: ['./group-update.component.css'],
  providers: [ ConfirmationService ]
})
export class GroupUpdateComponent implements OnInit {
  public groupForm: FormGroup;
  public limit: number;
  public offset: number;
  public group_id: string;
  public group: GroupPresenter = {
    id: '',
    name: '',
    description: '',
    picture: '',
  };
  public requests: JoinRequest[] = [];
  constructor(
    private groupsService: GroupsService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getGroup();
    this.getGroupRequests();
  }

  initForm() {
    this.groupForm = new FormGroup({
      name: new FormControl(this.group.name, Validators.required),
      description: new FormControl(this.group.description, Validators.required),
      category: new FormControl(this.group.category, Validators.required),
      picture: new FormControl(this.group.picture),
    });
  }

  onUpdateGroup() {
    const { name, description, category, picture } = this.groupForm.value;
    this.groupsService
      .updateGroupInfo({
        id: this.group.id,
        name,
        description,
        category,
        picture,
      })
      .subscribe(() => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }

  getGroup() {
    this.route.params.subscribe((params: Params) => {
      this.group_id = params['groupId'];
      this.groupsService
        .queryGroup({ group_id: this.group_id })
        .subscribe((res: any) => {
          this.group = res;
          this.initForm();
        });
    });
  }

  getGroupRequests() {
    this.limit = 5;
    this.offset = 0;
    this.groupsService
      .getGroupRequests({
        group_id: this.group_id,
        limit: this.limit,
        offset: this.offset,
      })
      .subscribe((res: any) => {
        this.requests = res.joinRequests;
        this.offset = this.offset + this.limit;
      });
  }

  onUpdateRequest(user_id: string, action: string, index: number) {
    this.groupsService
      .updateGroupRequest({ group_id: this.group.id, user_id, action })
      .subscribe(() => {
        this.requests.splice(index, 1);
      });
  }

  onDeleteGroup(event: Event) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Estás seguro que deseas eliminar este grupo?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.groupsService
          .deleteGroup(this.group.id)
          .subscribe(() => {
            this.router.navigate(['../../../mygroups'], { relativeTo: this.route });
          });
      },
      reject: () => {
        return;
      },
    });
  }
}
