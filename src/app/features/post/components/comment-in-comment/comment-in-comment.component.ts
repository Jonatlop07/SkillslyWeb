import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { JwtService } from 'src/app/core/service/jwt.service';
import { UserDataService } from 'src/app/features/user-account/services/user_data.service';
import { CommentsInCommentService } from '../../services/comments-in-comment.service';
import { FileUploadService } from '../../services/file_upload.service';
import { Comment } from '../../types/comment.presenter';

@Component({
  selector: 'app-comment-in-comment',
  templateUrl: './comment-in-comment.component.html',
  styleUrls: ['./comment-in-comment.component.css'],
})
export class CommentInCommentComponent implements OnInit {
  @Input() comment: Comment;
  @Input() index: number;
  @Output() deleted_inner_comment = new EventEmitter<number>();
  public owns_inner_comment = false;
  public invalid_comment_content = false;
  public file_to_upload: File | null = null;
  public updating_inner_comment = false;
  public owner_email = '';
  public owner_name = '';
  public inner_comment_description = '';
  public inner_comment_media_locator = '';
  public inner_comment_media_file = '';
  public media_type = '';
  public showResponse = false;
  public ready_to_send = true;

  constructor(
    private readonly jwt_service: JwtService,
    private readonly inner_comment_service: CommentsInCommentService,
    private readonly owner_data_service: UserDataService,
    private readonly media_service: FileUploadService
  ) {}

  ngOnInit(): void {
    this.inner_comment_media_locator = this.comment.media_locator || '';
    this.owns_inner_comment =
      this.comment.owner_id === this.jwt_service.getUserId();
    this.inner_comment_description = this.comment.description || '';
    this.inner_comment_media_file = this.comment.media_locator || '';
    this.media_type = this.comment.media_type || '';
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
    if (this.inner_comment_description || this.inner_comment_media_locator) {
      this.invalid_comment_content = false;
      this.inner_comment_service
        .editInnerComment(
          this.comment._id,
          this.inner_comment_description,
          this.inner_comment_media_locator,
          this.inner_comment_media_file
        )
        .subscribe((res: any) => {
          this.updating_inner_comment = false;
          this.inner_comment_description =
            res.data.updateInnerComment.description;
          this.inner_comment_media_locator =
            res.data.updateInnerComment.media_locator;
          this.media_type = res.data.updateInnerComment.media_type;
          this.setMedia(this.inner_comment_media_locator, this.media_type);
        });
    } else {
      this.invalid_comment_content = true;
    }
  }

  public deleteInnerComment() {
    this.inner_comment_service
      .deleteInnerComment(this.comment._id)
      .subscribe(() => {
        this.deleted_inner_comment.emit(this.index);
      });
  }

  public uploadCommentImage(file: File) {
    this.ready_to_send = false;
    this.media_service.uploadImage(file).subscribe((res) => {
      this.inner_comment_media_locator = res.media_locator;
      this.media_type = res.contentType;
      this.setMedia(this.inner_comment_media_locator, res.contentType);
      this.ready_to_send = true;
    });
  }

  public uploadCommentVideo(file: File) {
    this.ready_to_send = false;
    this.media_service.uploadVideo(file).subscribe((res) => {
      this.inner_comment_media_locator = res.media_locator;
      this.media_type = res.contentType;
      this.setMedia(this.inner_comment_media_locator, this.media_type);
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

  public setMedia(media: string, type: string) {
    this.inner_comment_media_file = media;
    this.media_type = type;
  }
}
