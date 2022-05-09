import { Component, Input, OnInit } from '@angular/core'
import { showErrorPopup } from '../../../../shared/pop-up/pop_up.utils'
import { CommentsInCommentService } from '../../services/comments-in-comment.service'
import * as moment from 'moment'
import { Comment } from '../../types/comment.presenter'

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

  constructor(private comments_in_comment_service: CommentsInCommentService) {}

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
    this.comments_in_comment_service.getComments(
      this.comment.id,
      page,
      limit
    ).subscribe(
      (comments: any) => {
        this.commentsInComment = comments;
      },
      (err) => {
        showErrorPopup(err.error.message);
      }
    );
  }

  sendComment() {
    if (this.commentInComment) {
      this.comments_in_comment_service.sendComment(
        this.comment.id,
        this.commentInComment
      ).subscribe(
        () => {
          this.commentInComment = '';
          this.ngOnInit();
        },
        (err) => {
          showErrorPopup('Ocurrió un error al enviar tu comentario')
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
    this.page = 0;
    this.limit = 2;
    this.getComments();
  }
}
