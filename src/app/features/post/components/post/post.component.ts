import { DeleteMyPost } from '../../../../shared/state/posts/posts.actions';
import { PostService } from '../../services/posts.service';
import { PermanentPostPresenter } from '../../types/query_post.presenter';
import { Store } from '@ngxs/store';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { SharePostInterface } from '../../types/share_post.interface';
import { DeletePostInterface } from '../../types/delete_post.interface';
import { Comment } from '../../types/comment.presenter';
import { FileUploadService } from '../../services/file_upload.service';

@Component({
  selector: 'skl-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() post: PermanentPostPresenter;
  @Input() owner_name: string;
  @Input() editable: boolean;
  @Input() group_id: string;
  @Input() id: string;
  @Output() toggleDelete = new EventEmitter<string>();
  public invalid_comment_content = false;
  public media_type = '';
  public comment_media_file = '';
  public showComments = false;
  public file_to_upload: File | null = null;
  public postComments: Array<Comment> = [];
  public comment = '';
  public media_locator = '';
  public page = 0;
  public limit = 2;
  public display = false;
  public items: MenuItem[];
  public owns_post = false;
  public ready_to_send = true;
  public loaded_media = false;

  constructor(
    private commentsService: CommentsService,
    private postService: PostService,
    private media_service: FileUploadService,
    private readonly store: Store,
    private router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.owns_post = this.postService.getUserId() === this.post.owner_id;
    this.getComments(false);
  }

  isImage(referenceType: string): boolean {
    return referenceType === 'imagen';
  }

  handleShowComments() {
    this.showComments = !this.showComments;
  }

  deletePost(post_id: string) {
    const deletePostInterface: DeletePostInterface = {
      id: post_id,
      group_id: this.group_id,
    };
    if (this.group_id) {
      this.postService.deletePost(deletePostInterface).subscribe(() => {
        this.toggleDelete.emit(this.id);
      });
    }
    this.postService.deletePost(deletePostInterface).subscribe(() => {
      this.store.dispatch(new DeleteMyPost(post_id));
    });
  }

  updatePost(post_id: string) {
    this.router.navigate([`../../edit/`, post_id], {
      relativeTo: this.activatedRoute,
    });
  }

  sharePost(post_id: string) {
    const sharePostInterface: SharePostInterface = {
      id: post_id,
    };
    this.postService
      .sharePost(sharePostInterface)
      .subscribe((resp) => console.log(resp));
  }

  sendComment() {
    if (this.comment || this.media_locator) {
      this.invalid_comment_content = false;
      this.commentsService
        .sendComment(
          this.post.id,
          this.comment,
          this.media_locator,
          this.media_type
        )
        .subscribe(
          (res) => {
            const {
              _id,
              description,
              media_locator,
              media_type,
              owner_id,
              created_at,
              owner,
            } = res.data.createComment;
            this.comment = '';
            this.postComments = [
              ...this.postComments,
              {
                _id,
                post_id: this.post.id,
                description,
                media_locator,
                media_type,
                owner,
                owner_id,
                created_at,
              },
            ];
            this.media_locator = '';
            this.loaded_media = false;
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      this.invalid_comment_content = true;
    }
  }

  handleMoreComments() {
    this.limit = 2;
    this.page = this.page === 0 ? this.page + 2 : this.page + 1;
    this.getComments(false);
  }

  resetComments() {
    this.page = 0;
    this.getComments(true);
  }

  getComments(reset: boolean, page = this.page, limit = this.limit) {
    this.commentsService.getComments(this.post.id, page, limit).subscribe(
      (res: any) => {
        if (reset) {
          this.postComments = [...res.data.queryComments];
        } else {
          this.postComments.push(...res.data.queryComments);
        }
      },
      (err) => {
        if (err.status === 404) {
          this.postComments = [];
        }
      }
    );
  }

  showDialog() {
    this.display = !this.display;
  }

  public uploadCommentImage(file: File) {
    this.ready_to_send = false;
    this.media_service.uploadImage(file).subscribe((res) => {
      this.media_locator = res.media_locator;
      this.media_type = res.contentType;
      this.comment_media_file = res.media_locator;
      this.loaded_media = true;
      this.ready_to_send = true;
    });
  }

  public uploadCommentVideo(file: File) {
    this.ready_to_send = false;
    this.media_service.uploadImage(file).subscribe((res) => {
      this.media_locator = res.media_locator;
      this.media_type = res.contentType;
      this.comment_media_file = res.media_locator;
      this.loaded_media = true;
      this.ready_to_send = true;
    });
  }

  public handleFileInput(event: any) {
    this.file_to_upload = event.target.files[0];
    if (this.file_to_upload.type.startsWith('video')) {
      this.uploadCommentVideo(this.file_to_upload);
    } else if (this.file_to_upload.type.startsWith('image')) {
      this.uploadCommentImage(this.file_to_upload);
    }
  }

  public onDeletedComment(comment_index: number) {
    this.postComments = this.postComments.filter(
      (items, index) => index !== comment_index
    );
  }
}
