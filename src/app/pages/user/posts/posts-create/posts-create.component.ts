import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { PermanentPostPresenter } from 'src/app/interfaces/presenter/post/query_post.presenter';
import { PostService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-posts-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css'],
})
export class PostsCreateComponent implements OnInit {

  @Output() toggleCreate = new EventEmitter<PermanentPostPresenter>();
  @Input() group_id: string;

  allowedTypes = '^imagen$|^video$';
  postForm: FormGroup;
  requireOne = false;
  referenceIncomplete = false;
  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.postForm = new FormGroup({
      content: new FormArray([
        new FormGroup({
          description: new FormControl(null, Validators.maxLength(250)),
          reference: new FormControl(null),
          reference_type: new FormControl(null, [
            Validators.pattern(`${this.allowedTypes}`),
          ]),
        }),
      ]),
      privacy: new FormControl('public', Validators.required)
    });
  }

  get controls() {
    return (<FormArray> this.postForm.get('content')).controls;
  }

  onAddContent() {
    (<FormArray> this.postForm.get('content')).push(
      new FormGroup({
        description: new FormControl(null, Validators.maxLength(250)),
        reference: new FormControl(null),
        reference_type: new FormControl(null, [
          Validators.pattern(`${this.allowedTypes}`),
        ]),
      })
    );
  }

  onDeleteContent(index: number) {
    (<FormArray> this.postForm.get('content')).removeAt(index);
  }

  onCancel() {
    this.postService.onToggleCreate();
    this.router.navigate(['./main']);
  }

  onSubmit($event: Event) {
    const controls = (<FormArray> this.postForm.get('content')).controls;
    if (this.validateContent(controls)) {
      this.referenceIncomplete = false;
      this.requireOne = false;
      this.postService.createPost(this.postForm.value, this.group_id).subscribe((res:any) => {
        this.toggleCreate.emit(res as PermanentPostPresenter);
      });
      if (!this.group_id){
        this.router.navigate(['./main/feed']);
      }
      return true;
    } else {
      $event.preventDefault();
      return false;
    }
  }

  validateContent(controls: AbstractControl[]) {
    for (const control of controls) {
      if (
        !control.get('description').value &&
        !control.get('reference').value &&
        !control.get('reference_type').value
      ) {
        this.requireOne = true;
        return false;
      }
      if (
        !control.get('reference').value &&
          control.get('reference_type').value ||
        control.get('reference').value && !control.get('reference_type').value
      ) {
        this.referenceIncomplete = true;
        return false;
      }
    }
    return true;
  }

  
}
