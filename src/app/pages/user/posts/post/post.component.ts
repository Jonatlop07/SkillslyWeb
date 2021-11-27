import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/app/interfaces/presenter/comment.presenter';
import { PermanentPostPresenter } from 'src/app/interfaces/presenter/query_post.presenter';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() post: PermanentPostPresenter;
  public showComments = false;
  public postComments: Array<Comment> = [];
  public comment: string;
  public page = 0;
  public limit = 2;

  constructor(private commentsService: CommentsService) {}

  ngOnInit(page = this.page, limit = this.limit): void {
    this.commentsService.getComments(this.post.post_id, page, limit).subscribe(
      (comments: any) => {
        this.postComments = comments;
      },
      (err) => {
        if (err.status === 404) {
          this.postComments = [];
        }
      }
    );
    // console.log(this.postComments);
  }

  isImage(referenceType: string): boolean {
    if (referenceType == 'image') {
      return true;
    }
    return false;
  }

  handleShowComments() {
    this.showComments = !this.showComments;
  }

  sendComment() {
    if (this.comment) {
      this.commentsService
        .sendComment(this.post.post_id, this.comment)
        .subscribe(
          () => {
            this.comment = '';
            this.ngOnInit();
          },
          (err) => {
            console.log(err.status);
          }
        );
    }
  }

  handleMoreComments() {
    this.limit = 10;
    this.ngOnInit(this.page, this.limit);
    this.page += 1;
  }

  resetComments() {
    this.page -= 1;
    if (this.page === 0) {
      this.limit = 2;
    } else {
      this.limit = 10;
    }

    this.ngOnInit();
  }
}
