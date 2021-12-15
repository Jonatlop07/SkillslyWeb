import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { resetFakeAsyncZone } from '@angular/core/testing';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GroupPresenter } from 'src/app/interfaces/presenter/group/groups.presenter';
import { GroupsService } from 'src/app/services/groups.service';


@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.css']
})
export class GroupCreateComponent implements OnInit {

  @Output() toggleCreate = new EventEmitter<GroupPresenter>();

  groupForm: FormGroup;
  created_group: GroupPresenter
  requireOne = false;
  referenceIncomplete = false;
  constructor(private router: Router, private groupsService: GroupsService) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.groupForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      category: new FormControl(null, Validators.required),
      picture: new FormControl('')
    });
  }

  onSubmit(){
    this.groupsService.createGroup(this.groupForm.value).subscribe(
      (res: any) => {
        const { id, name, description, picture } = res
        this.created_group = { id, name, description, picture };
        this.toggleCreate.emit(this.created_group);
      }
    )
  }

}