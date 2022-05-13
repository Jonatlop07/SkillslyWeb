import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { JwtService } from 'src/app/core/service/jwt.service';
import { CommentsInCommentService } from '../../services/comments-in-comment.service';
import { Comment } from '../../types/comment.presenter';

@Component({
  selector: 'app-comment-in-comment',
  templateUrl: './comment-in-comment.component.html',
  styleUrls: ['./comment-in-comment.component.css'],
})
export class CommentInCommentComponent implements OnInit {
  @Input() comment: Comment;
  @Input() index: number;
  @Output() deleted_inner_comment: EventEmitter<number>;
  public owns_inner_comment = false;
  public file_to_upload: File | null = null;
  public updating_inner_comment = false;
  public inner_comment_description = '';
  public inner_comment_media_locator = '';
  public media_resource = '';
  public showResponse = false;

  constructor(
    private readonly jwt_service: JwtService,
    private readonly inner_comment_service: CommentsInCommentService
  ) {}

  ngOnInit(): void {
    // this.owns_inner_comment = this.comment._id === this.jwt_service.getUserId();
    this.inner_comment_description = this.comment.description;
  }

  transformDate() {
    moment.locale('es');
    return moment(this.comment.timestamp).fromNow();
  }

  viewDate() {
    moment.locale('es');
    return moment(this.comment.timestamp).format('LLL');
  }

  public toggleUpdateInnerComment() {
    this.updating_inner_comment = !this.updating_inner_comment;
  }

  public updateInnerComment() {
    this.inner_comment_service
      .editInnerComment(
        this.comment._id,
        this.comment.description,
        this.comment.media_locator
      )
      .subscribe((updated_content: any) => {
        this.updating_inner_comment = false;
        this.comment.description = updated_content.description;
        this.comment.media_locator = updated_content.media_locator;
      });
  }

  public deleteInnerComment() {
    this.updating_inner_comment = false;
    this.inner_comment_service
      .deleteInnerComment(this.comment._id)
      .subscribe(() => {
        this.deleted_inner_comment.emit(this.index);
      });
  }

  public handleFileInput(event: any) {
    this.file_to_upload = event.target.files[0];
  }
}
