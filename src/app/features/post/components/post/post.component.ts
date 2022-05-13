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

  public showComments = false;
  public file_to_upload: File | null = null;
  public postComments: Array<Comment> = [];
  public comment: string;
  public media_locator = '';
  public media: File;
  public page = 0;
  public limit = 2;
  public display = false;
  public items: MenuItem[];
  public owns_post = false;
  public test_com: Comment = {
    name: 'Pablo',
    owner_id: '1',
    description: 'Comments that make books and comments that make comments',
    email: 'whyisthishere@email.com',
    created_at: new Date().toString(),
    _id: '1',
    media_locator: 'https://images8.alphacoders.com/100/thumb-1920-1003525.jpg',
  };

  constructor(
    private commentsService: CommentsService,
    private postService: PostService,
    private readonly store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.owns_post = this.postService.getUserId() === this.post.owner_id;
    this.getComments();
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
    console.log(typeof this.media);
    if (this.comment) {
      this.commentsService
        .sendComment(this.post.id, this.comment, this.media_locator)
        .subscribe(
          () => {
            this.comment = '';
            this.getComments();
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  handleMoreComments() {
    this.limit = 10;
    this.getComments();
    this.page += 1;
  }

  resetComments() {
    this.page -= 1;
    if (this.page === 0) {
      this.limit = 2;
    } else {
      this.limit = 10;
    }
    this.getComments();
  }

  getComments(page = this.page, limit = this.limit) {
    this.postComments = [this.test_com, this.test_com, this.test_com];
    // this.commentsService.getComments(this.post.post_id, page, limit).subscribe(
    //   (comments: any) => {
    //     this.postComments = comments;
    //   },
    //   (err) => {
    //     if (err.status === 404) {
    //       this.postComments = [];
    //     }
    //   }
    // );
  }

  showDialog() {
    this.display = !this.display;
  }

  public handleFileInput(event: any) {
    this.file_to_upload = event.target.files[0];
  }
}
