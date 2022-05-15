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
  public media_type = '';
  public showResponse = false;

  constructor(
    private readonly jwt_service: JwtService,
    private readonly inner_comment_service: CommentsInCommentService,
    private readonly owner_data_service: UserDataService,
    private readonly media_service: FileUploadService
  ) {}

  ngOnInit(): void {
    this.owns_inner_comment = this.comment._id === this.jwt_service.getUserId();
    this.inner_comment_description = this.comment.description;
    this.inner_comment_media_locator =
      this.comment.media_locator.split(' ')[0] || '';
    this.media_type = this.comment.media_locator.split(' ')[1] || '';
    this.owner_data_service
      .getUserNameAndEmail(this.comment.owner_id)
      .subscribe(({ data }) => {
        this.owner_name = data.user.name;
        this.owner_email = data.user.email;
      });
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
          this.inner_comment_media_locator
        )
        .subscribe((res: any) => {
          this.updating_inner_comment = false;
          this.inner_comment_description = res.data.updateComment.description;
          this.inner_comment_media_locator =
            res.data.updateComment.media_locator;
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
    this.media_service.uploadImage(file).subscribe((res) => {
      console.log(res);
      this.inner_comment_media_locator = `${res.media_locator} ${res.contentType}`;
    });
  }

  public uploadCommentVideo(file: File) {
    this.media_service.uploadImage(file).subscribe((res) => {
      console.log(res);
      this.inner_comment_media_locator = `${res.media_locator} ${res.contentType}`;
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
}
