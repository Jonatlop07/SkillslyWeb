import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { showErrorPopup } from '../../../../shared/pop-up/pop_up.utils';
import { CommentsInCommentService } from '../../services/comments-in-comment.service';
import * as moment from 'moment';
import { Comment } from '../../types/comment.presenter';
import { InnerComment } from '../../types/inner_comment.presenter';
import { JwtService } from 'src/app/core/service/jwt.service';
import { CommentsService } from '../../services/comments.service';
import { UserDataService } from 'src/app/features/user-account/services/user_data.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;
  @Input() index: number;
  @Output() deleted_comment = new EventEmitter<number>();
  public showResponse = false;
  public invalid_comment_content = false;
  public invalid_inner_comment_content = false;
  public owner_email = '';
  public owner_name = '';
  public file_to_upload: File | null = null;
  public commentsInComment: Array<InnerComment> = [];
  public page = 1;
  public limit = 2;
  public owns_comment = false;
  public comment_updating = false;
  public comment_in_comment: string;
  public inner_comment_media_locator: string;
  public description: string;
  public media_locator = '';

  constructor(
    private comments_in_comment_service: CommentsInCommentService,
    private comment_service: CommentsService,
    private owner_data_service: UserDataService,
    private jwt_service: JwtService
  ) {}

  ngOnInit(): void {
    this.description = this.comment.description || '';
    this.media_locator = this.comment.media_locator || '';
    this.owns_comment = this.comment._id === this.jwt_service.getUserId();
    //getting user data from acc service for now
    this.owner_data_service
      .getUserNameAndEmail(this.comment.owner_id)
      .subscribe(({ data }) => {
        this.owner_name = data.user.name;
        this.owner_email = data.user.email;
      });
    this.getComments(false);
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

  getComments(reset: boolean, page = this.page, limit = this.limit) {
    this.comments_in_comment_service
      .getInnerComments(this.comment._id, page, limit)
      .subscribe(
        (res: any) => {
          if (reset) {
            this.commentsInComment = [...res.data.queryInnerComments];
          } else {
            this.commentsInComment.push(...res.data.queryInnerComments);
          }
        },
        (err) => {
          showErrorPopup(err.message);
        }
      );
  }

  sendComment() {
    if (this.comment_in_comment || this.inner_comment_media_locator) {
      this.invalid_inner_comment_content = false;
      this.comments_in_comment_service
        .sendInnerComment(
          this.comment._id,
          this.comment_in_comment,
          this.inner_comment_media_locator
        )
        .subscribe(
          (res) => {
            this.comment_in_comment = '';
            const { _id, description, media_locator, owner_id, created_at } =
              res.data.createInnerComment;
            this.commentsInComment = [
              ...this.commentsInComment,
              {
                _id,
                comment_id: this.comment._id,
                description,
                media_locator,
                owner_id,
                created_at,
              },
            ];
          },
          (error) => {
            console.log(error);
            showErrorPopup('Ocurrió un error al enviar tu comentario');
          }
        );
    } else {
      this.invalid_inner_comment_content = true;
    }
  }

  toggleUpdateComment() {
    this.comment_updating = !this.comment_updating;
  }

  handleMoreComments() {
    console.log('more ' + this.page);
    this.limit = 2;
    this.page += 1;
    this.getComments(false);
  }

  resetComments() {
    console.log('reset ' + this.page);
    this.page = 1;
    this.limit = 2;
    this.getComments(true);
  }

  public deleteComment() {
    this.comment_service.deleteComment(this.comment._id).subscribe(() => {
      this.deleted_comment.emit(this.index);
    });
  }

  public updateComment() {
    if (this.description || this.media_locator) {
      this.invalid_comment_content = false;
      this.comment_service
        .editComment(this.comment._id, this.description, this.media_locator)
        .subscribe((res: any) => {
          this.comment_updating = false;
          this.description = res.data.updateComment.description;
          this.media_locator = res.data.updateComment.media_locator;
        });
    } else {
      this.invalid_comment_content = true;
    }
  }

  public onDeleteInnerComment(inner_comment_index: number) {
    this.commentsInComment = this.commentsInComment.filter(
      (comment, index) => inner_comment_index !== index
    );
  }

  public handleFileInput(event: any) {
    this.file_to_upload = event.target.files[0];
  }
}
