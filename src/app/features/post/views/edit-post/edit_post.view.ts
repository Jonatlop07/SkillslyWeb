import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdatePostInputData } from '../../types/update_post.presenter';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PostService } from '../../services/posts.service';
import { Location } from '@angular/common';
import {FileUploadService} from "../../services/file_upload.service";

@Component({
  selector: 'skl-edit-post-view',
  templateUrl: './edit_post.view.html',
  styleUrls: ['./edit_post.view.css'],
})
export class EditPostView {
  //files
  public file_to_upload: File | null = null;
  public ready_to_send = true;
  public media_locator = '';
  public media_type = '';
  public media_file = '';
  public loaded_media = false;

  public id: string;
  public post: UpdatePostInputData;
  public post_to_update: UpdatePostInputData;
  public post_form: FormGroup;

  requireOne = false;
  mediaIncomplete = false;

  constructor(
    private readonly activated_route: ActivatedRoute,
    private readonly post_service: PostService,
    private readonly router: Router,
    private readonly location: Location,
    private media_service: FileUploadService
  ) {}

  ngOnInit(): void {
    this.activated_route.params.subscribe((params) => {
      this.id = params.post_id;
      this.post_service.queryPost(this.id).subscribe(({ data }) => {
        this.post = data.postById;
        this.initForm(this.post);
      });
    });
  }

  private initForm(post_form_values: UpdatePostInputData) {
    this.post_form = new FormGroup({
      description: new FormControl(post_form_values.description),
      privacy: new FormControl(post_form_values.privacy, Validators.required),
      content_element: new FormArray(
        post_form_values.content_element.map(
          (content_element) =>
            new FormGroup({
              description: new FormControl(
                content_element.description,
                Validators.maxLength(250)
              ),
              media_locator: new FormControl(content_element.media_locator),
              media_type: new FormControl(content_element.media_type),
            })
        )
      ),
    });
  }

  get controls() {
    return (<FormArray> this.post_form.get('content_element')).controls;
  }

  public handleFileInput(event: any) {
    this.file_to_upload = event.target.files[0];
    if (this.file_to_upload.type.startsWith('video')) {
      this.uploadContentElementVideo(this.file_to_upload);
    } else if (this.file_to_upload.type.startsWith('image')) {
      this.uploadContentElementImage(this.file_to_upload);
    }
  }
  public uploadContentElementVideo(file: File) {
    this.ready_to_send = false;
    this.media_service.uploadVideo(file).subscribe((res) => {
      this.media_locator = `${res.media_locator} ${res.contentType}`;
      this.media_type = res.contentType;
      this.media_file = res.media_locator;
      this.loaded_media = true;
      this.ready_to_send = true;
    });
  }

  public uploadContentElementImage(file: File) {
    this.ready_to_send = false;
    this.media_service.uploadImage(file).subscribe((res) => {
      this.media_locator = `${res.media_locator} ${res.contentType}`;
      this.media_type = res.contentType;
      this.media_file = res.media_locator;
      this.loaded_media = true;
      this.ready_to_send = true;
    });
  }

  onSubmit($event: Event) {
    const controls = (<FormArray> this.post_form.get('content')).controls;
    if (this.validateContent(controls)) {
      this.mediaIncomplete = false;
      this.requireOne = false;
      this.post_to_update = {
        ...this.post_form.value,
        id: this.post.id,
        owner_id: this.post.owner_id,
      };
      this.post_service
        .updatePermanentPost(this.post_to_update)
        .subscribe(({data}) => {
          this.post = data.post;
        });
      this.location.back();
      return true;
    } else {
      $event.preventDefault();
      return false;
    }
  }

  onAddContent() {
    (<FormArray> this.post_form.get('content_element')).push(
      new FormGroup({
        description: new FormControl(null, Validators.maxLength(250)),
        media_locator: new FormControl(null),
        media_type: new FormControl(null),
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
        !control.get('media').value
      ) {
        this.requireOne = true;
        return false;
      }
      if (
        !control.get('media').value ||
        !control.get('media_type').value
      ){
        this.mediaIncomplete = true;
        return false;
      }
    }
    return true;
  }
}
