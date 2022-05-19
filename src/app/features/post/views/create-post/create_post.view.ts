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
import {FileUploadService} from "../../services/file_upload.service";
import {NewPostInputData, PostContentElement} from "../../types/create_post_data.presenter";

@Component({
  selector: 'skl-create-post-view',
  templateUrl: './create_post.view.html',
  styleUrls: ['./create_post.view.css'],
})
export class CreatePostView {
  @Output() toggleCreate = new EventEmitter<PermanentPostPresenter>();
  @Input() group_id: string;
  //files
  public file_to_upload: File | null = null;
  public ready_to_send = true;
  public media_locator = '';
  public media_type = '';
  public media_file = '';
  public loaded_media = false;
  public postContentElement: PostContentElement[] = [];

  postForm: FormGroup;
  requireOne = false;
  mediaIncomplete = false;

  constructor(private postService: PostService,
              private router: Router,
              private media_service: FileUploadService,) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.postForm = new FormGroup({
      description: new FormControl(),
      privacy: new FormControl('public', Validators.required),
      content_element: new FormArray([
        new FormGroup({
          description: new FormControl(null, Validators.maxLength(250)),
          media_locator: new FormControl(null),
          media_type: new FormControl(null),
        }),
      ]),
    });
  }

  get controls() {
    return (<FormArray> this.postForm.get('content_element')).controls;
  }

  onAddContent() {
    (<FormArray> this.postForm.get('content_element')).push(
      new FormGroup({
        description: new FormControl(null, Validators.maxLength(250)),
        media_locator: new FormControl(null),
        media_type: new FormControl(null),
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
      this.postContentElement.push({
        description: "Prueba",
        media_locator: res.media_locator,
        media_type: res.contentType,
      });
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
      this.postContentElement.push({
        description: "Prueba",
        media_locator: res.media_locator,
        media_type: res.contentType,
      });
    });

  }

  onSubmit($event: Event) {
    const controls = (<FormArray> this.postForm.get('content_element')).controls;
    const content_element: PostContentElement[] = [];
    for ( const i in this.postContentElement){
      content_element.push({
        description: this.postForm.value.content_element[i].description,
        media_locator:this.postContentElement[i].media_locator,
        media_type: this.postContentElement[i].media_type,
      });
    }
    const newPostInputData : NewPostInputData ={
      ...this.postForm.value,
      content_element
    }
    if (this.validateContent(controls)) {
      this.mediaIncomplete = false;
      this.requireOne = false;
      this.postService.createPost(newPostInputData).subscribe((res: any) => {
        this.toggleCreate.emit(res as PermanentPostPresenter);
      });
      this.router.navigate(['./feed']);
      return true;
    } else {
      $event.preventDefault();
      return false;
    }
  }

  validateContent(controls: AbstractControl[]) {
    for (const control of controls) {
      if (
        !control.get('description').value
      ) {
        this.requireOne = true;
        return false;
      }
    }
    return true;
  }
}
