import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PostService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-posts-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css'],
})
export class PostsCreateComponent implements OnInit {
  allowedTypes = '^imagen$|^video$';
  postForm: FormGroup;
  requireOne = false;
  referenceIncomplete = false;
  constructor(private postService: PostService) {}

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
  }

  onSubmit($event: Event) {
    const controls = (<FormArray> this.postForm.get('content')).controls;
    if (this.validateContent(controls)) {
      this.referenceIncomplete = false;
      this.requireOne = false;
      this.postService.createPost(this.postForm.value);
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
