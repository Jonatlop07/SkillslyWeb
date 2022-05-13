import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { showErrorPopup } from '../../../../shared/pop-up/pop_up.utils';
import { CommentsInCommentService } from '../../services/comments-in-comment.service';
import * as moment from 'moment';
import { Comment } from '../../types/comment.presenter';
import { InnerComment } from '../../types/inner_comment.presenter';
import { JwtService } from 'src/app/core/service/jwt.service';
import { CommentsService } from '../../services/comments.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;
  @Input() index: number;
  @Output() deleted_comment: EventEmitter<number>;
  public showResponse = false;
  public file_to_upload: File | null = null;
  public commentsInComment: Array<InnerComment> = [];
  public page = 0;
  public limit = 2;
  public owns_comment = false;
  public comment_updating = false;
  public commentInComment: string;
  public description: string;
  public media_resource: File;
  public media_locator = '';
  public test_com = {
    name: 'Pablo',
    owner_id: '1',
    description: 'Comments that make books and comments that make comments',
    media_locator: 'https://i.ytimg.com/vi/IOWX8kpJ8FI/maxresdefault.jpg',
    email: 'whyisthishere@email.com',
    created_at: new Date().toString(),
    _id: '1',
  };

  constructor(
    private comments_in_comment_service: CommentsInCommentService,
    private comment_service: CommentsService,
    private jwt_service: JwtService
  ) {}

  ngOnInit(): void {
    this.description = this.comment.description || '';
    this.owns_comment = this.comment._id === this.jwt_service.getUserId();
    this.getComments();
  }

  transformDate() {
    moment.locale('es');
    return moment(this.comment.created_at).fromNow();
  }

  viewDate() {
    moment.locale('es');
    return moment(this.comment.created_at).format('LLL');
  }

  handleShowResponse() {
    this.showResponse = !this.showResponse;
  }

  getComments(page = this.page, limit = this.limit) {
    this.commentsInComment = [this.test_com, this.test_com, this.test_com];
    // this.comments_in_comment_service
    //   .getInnerComments(this.comment.id, page, limit)
    //   .subscribe(
    //     (comments: any) => {
    //       this.commentsInComment = comments;
    //     },
    //     (err) => {
    //       showErrorPopup(err.error.message);
    //     }
    //   );
  }

  sendComment() {
    if (this.commentInComment) {
      this.comments_in_comment_service
        .sendInnerComment(
          this.comment._id,
          this.commentInComment,
          this.media_locator
        )
        .subscribe(
          () => {
            this.commentInComment = '';
            this.getComments();
          },
          (error) => {
            console.log(error);
            showErrorPopup('Ocurrió un error al enviar tu comentario');
          }
        );
    }
  }

  toggleUpdateComment() {
    this.comment_updating = !this.comment_updating;
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

  public deleteComment() {
    this.comment_service.deleteComment(this.comment._id).subscribe(() => {
      this.deleted_comment.emit(this.index);
    });
  }

  public updateComment() {
    this.comment.description = this.description;
    this.comment_service
      .editComment(
        this.comment._id,
        this.comment.description,
        this.comment.media_locator
      )
      .subscribe((updated_content: any) => {
        this.comment_updating = false;
        this.comment.description = updated_content.description;
        this.comment.media_locator = updated_content.media_locator;
      });
  }

  public createInnerComment() {
    if (this.comment) {
      this.comments_in_comment_service
        .sendInnerComment(
          this.comment._id,
          this.comment.description,
          this.media_locator
        )
        .subscribe(
          (created_comment: any) => {
            console.log(created_comment);
            this.getComments();
          },
          (err) => {
            console.log(err);
          }
        );
    }
    this.showResponse = !this.showResponse;
  }

  public handleFileInput(event: any) {
    this.file_to_upload = event.target.files[0];
  }
}
