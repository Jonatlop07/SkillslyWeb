import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Comment } from 'src/app/interfaces/comments/comment.presenter';
import { CommentsInCommentService } from 'src/app/services/comments-in-comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;
  public showResponse = false;
  public commentsInComment: Array<Comment> = [];
  public page = 0;
  public limit = 2;
  public commentInComment: string;

  constructor(private CommentsInCommentService: CommentsInCommentService) {}

  ngOnInit(): void {
    this.getComments();
  }

  transformDate() {
    moment.locale('es');
    return moment(this.comment.timestamp).fromNow();
  }

  viewDate() {
    moment.locale('es');
    return moment(this.comment.timestamp).format('LLL');
  }

  handleShowResponse() {
    this.showResponse = !this.showResponse;
  }

  getComments(page = this.page, limit = this.limit) {
    this.CommentsInCommentService.getComments(
      this.comment.id,
      page,
      limit
    ).subscribe(
      (comments: any) => {
        this.commentsInComment = comments;
      },
      (err) => {
        if (err.status === 404) {
          this.commentsInComment = [];
        }
      }
    );
  }

  sendComment() {
    if (this.commentInComment) {
      this.CommentsInCommentService.sendComment(
        this.comment.id,
        this.commentInComment
      ).subscribe(
        () => {
          this.commentInComment = '';
          this.ngOnInit();
        },
        (err) => {
          console.log(err.status);
        }
      );
    }
  }

  handleMoreComments() {
    console.log('hola');
    this.limit = 10;
    this.getComments();
    this.page += 1;
    console.log(this.page);
  }

  resetComments() {
    this.page = 0;
    this.limit = 2;
    this.getComments();
  }
}
