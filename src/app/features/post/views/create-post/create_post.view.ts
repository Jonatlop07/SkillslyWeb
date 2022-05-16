import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PostService } from '../../services/posts.service';
import { PermanentPostPresenter } from '../../types/query_post.presenter';
import { Router } from '@angular/router';

@Component({
  selector: 'skl-create-post-view',
  templateUrl: './create_post.view.html',
  styleUrls: ['./create_post.view.css'],
})
export class CreatePostView {
  @Output() toggleCreate = new EventEmitter<PermanentPostPresenter>();
  @Input() group_id: string;

  allowedTypes = '^imagen$|^video$';
  postForm: FormGroup;
  requireOne = false;
  mediaIncomplete = false;
  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.postForm = new FormGroup({
      description: new FormControl(),
      content_element: new FormArray([
        new FormGroup({
          description: new FormControl(null, Validators.maxLength(250)),
          media_locator: new FormControl(null),
          media_type: new FormControl(null, [
            Validators.pattern(`${this.allowedTypes}`),
          ]),
        }),
      ]),
      privacy: new FormControl('public', Validators.required),
    });
  }

  get controls() {
    return (<FormArray>this.postForm.get('content_element')).controls;
  }

  onAddContent() {
    (<FormArray>this.postForm.get('content_element')).push(
      new FormGroup({
        description: new FormControl(null, Validators.maxLength(250)),
        media_locator: new FormControl(null),
        media_type: new FormControl(null, [
          Validators.pattern(`${this.allowedTypes}`),
        ]),
      })
    );
  }

  onDeleteContent(index: number) {
    (<FormArray> this.postForm.get('content_element')).removeAt(index);
  }

  onCancel() {
    this.postService.onToggleCreate();
    this.router.navigate(['./feed']);
  }

  onSubmit($event: Event) {
    const controls = (<FormArray> this.postForm.get('content_element')).controls;
    if (this.validateContent(controls)) {
      this.mediaIncomplete = false;
      this.requireOne = false;
      this.postService.createPost(this.postForm.value).subscribe((res: any) => {
        this.toggleCreate.emit(res as PermanentPostPresenter);
      });
      if (!this.group_id) {
        // this.router.navigate(['./feed']);
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
        !control.get('media_locator').value &&
        !control.get('media_type').value
      ) {
        this.requireOne = true;
        return false;
      }
      if (
        (!control.get('media_locator').value && control.get('media_type').value) ||
        (control.get('media_locator').value && !control.get('media_type').value)
      ) {
        this.mediaIncomplete = true;
        return false;
      }
    }
    return true;
  }
}
