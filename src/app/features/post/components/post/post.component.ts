import { DeleteMyPost } from '../../../../shared/state/posts/posts.actions';
import { PostService } from '../../services/posts.service';
import { PermanentPostPresenter } from '../../types/query_post.presenter';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { SharePostInterface } from '../../types/share_post.interface';
import { DeletePostInterface } from '../../types/delete_post.interface';
import { post_routing_paths } from '../../post.routing';
import { Comment } from '../../types/comment.presenter';
import { FileUploadService } from '../../services/file_upload.service';

@Component({
  selector: 'skl-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() post: PermanentPostPresenter;
  @Input() editable: boolean;
  @Input() group_id: string;
  @Input() id: string;
  @Output() toggleDelete = new EventEmitter<string>();
  public invalid_comment_content = false;
  public showComments = false;
  public file_to_upload: File | null = null;
  public postComments: Array<Comment> = [];
  public comment: string;
  public media_locator = '';
  public page = 0;
  public limit = 2;
  public display = false;
  public items: MenuItem[];
  public owns_post = false;

  constructor(
    private commentsService: CommentsService,
    private postService: PostService,
    private media_service: FileUploadService,
    private readonly store: Store,
    private router: Router
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
    this.router.navigate([post_routing_paths.edit_post, post_id]);
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
        .sendComment(this.post.id, this.comment, this.media_locator)
        .subscribe(
          (res) => {
            const { _id, description, media_locator, owner_id, created_at } =
              res.data.createComment;
            this.comment = '';
            this.postComments = [
              ...this.postComments,
              {
                _id,
                post_id: this.post.id,
                description,
                media_locator,
                owner_id,
                created_at,
              },
            ];
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

  public uploadPostImage(file: File) {
    const form_data = new FormData();
    form_data.append('media', file, file.name);
    this.media_service.uploadImage(file, form_data).subscribe((res) => {
      console.log(res);
      this.media_locator = res.media_locator;
    });
  }

  public handleFileInput(event: any) {
    this.file_to_upload = event.target.files[0];
    this.uploadPostImage(this.file_to_upload);
  }

  public onDeletedComment(comment_index: number) {
    this.postComments = this.postComments.filter(
      (items, index) => index !== comment_index
    );
  }
}
