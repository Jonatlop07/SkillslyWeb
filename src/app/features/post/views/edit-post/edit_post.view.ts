import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { UpdatePostPresenter } from '../../types/update_post.presenter'
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms'
import { PostService } from '../../services/posts.service'
import { PermanentPostPresenter } from '../../types/query_post.presenter'
import { Location } from '@angular/common'

@Component({
  selector: 'skl-edit-post-view',
  templateUrl: './edit_post.view.html',
  styleUrls: ['./edit_post.view.css']
})
export class EditPostView {
  public post_id: string;
  public post: UpdatePostPresenter;
  public post_to_update: UpdatePostPresenter;
  public post_form: FormGroup;

  require_one = false;
  incomplete_reference = false;
  allowed_types = '^imagen$|^video$';

  constructor(
    private readonly activated_route: ActivatedRoute,
    private readonly post_service: PostService,
    private readonly router: Router,
    private readonly location: Location
  ) {
  }

  ngOnInit(): void {
    this.activated_route.params.subscribe(params => {
      this.post_id = params.post_id;
      this.post_service
        .queryPost(this.post_id)
        .subscribe((post: PermanentPostPresenter) => {
          this.post = post;
          this.initForm(this.post);
        });
    })
  }

  private initForm(post_form_values: UpdatePostPresenter) {
    this.post_form = new FormGroup({
      privacy: new FormControl(post_form_values.privacy, Validators.required),
      content: new FormArray(post_form_values.content.map(
        (content_element) =>
          new FormGroup({
            description: new FormControl(content_element.description, Validators.maxLength(250)),
            reference: new FormControl(content_element.reference),
            reference_type: new FormControl(content_element.reference_type, [
              Validators.pattern(`${this.allowed_types}`),
            ]),
          })
      )),
    });
  }

  get controls() {
    return (<FormArray> this.post_form.get('content')).controls;
  }

  onSubmit($event: Event) {
    const controls = (<FormArray> this.post_form.get('content')).controls;
    if (this.validateContent(controls)) {
      this.incomplete_reference = false;
      this.require_one = false;
      this.post_to_update = {
        ...this.post_form.value,
        post_id: this.post.post_id,
        owner_id: this.post.owner_id,
      }
      this.post_service
        .updatePermanentPost(this.post_to_update)
        .subscribe((post: UpdatePostPresenter) => {
          this.post = post;
        });
      this.location.back();
      return true;
    } else {
      $event.preventDefault();
      return false;
    }
  }

  onAddContent() {
    (<FormArray> this.post_form.get('content')).push(
      new FormGroup({
        description: new FormControl(null, Validators.maxLength(250)),
        reference: new FormControl(null),
        reference_type: new FormControl(null, [
          Validators.pattern(`${this.allowed_types}`),
        ]),
      })
    );
  }

  onDeleteContent(index: number) {
    (<FormArray> this.post_form.get('content')).removeAt(index);
  }

  onCancel() {
    this.post_service.onToggleCreate();
    this.location.back();
  }

  validateContent(controls: AbstractControl[]) {
    for (const control of controls) {
      if (
        !control.get('description').value &&
        !control.get('reference').value &&
        !control.get('reference_type').value
      ) {
        this.require_one = true;
        return false;
      }
      if (
        !control.get('reference').value &&
        control.get('reference_type').value ||
        control.get('reference').value && !control.get('reference_type').value
      ) {
        this.incomplete_reference = true;
        return false;
      }
    }
    return true;
  }
}
