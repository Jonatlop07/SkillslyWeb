import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { showErrorPopup } from '../../../../shared/pop-up/pop_up.utils';
import { CommentsInCommentService } from '../../services/comments-in-comment.service';
import * as moment from 'moment';
import { Comment } from '../../types/comment.presenter';
import { InnerComment } from '../../types/inner_comment.presenter';
import { JwtService } from 'src/app/core/service/jwt.service';
import { CommentsService } from '../../services/comments.service';
import { FileUploadService } from '../../services/file_upload.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;
  @Input() index: number;
  @Output() deleted_comment = new EventEmitter<number>();
  @ViewChild('responseScroll') responseScroll: ElementRef;
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
  public comment_in_comment = '';
  public inner_comment_media_locator: string;
  public inner_comment_creation_media_file = '';
  public inner_comment_creation_media_type = '';
  public description: string;
  public media_locator_image = '';
  public media_type = '';
  public shown_media = '';
  public shown_media_type = '';
  public media_locator = '';
  public ready_to_send = true;
  public loaded_media = false;

  constructor(
    private comments_in_comment_service: CommentsInCommentService,
    private comment_service: CommentsService,
    private media_service: FileUploadService,
    private jwt_service: JwtService
  ) {}

  ngOnInit(): void {
    this.description = this.comment.description || '';
    this.media_locator = this.comment.media_locator || '';
    this.media_locator_image = this.comment.media_locator || '';
    this.shown_media = this.comment.media_locator || '';

    this.media_type = this.comment.media_type;
    this.shown_media_type = this.comment.media_type;
    this.owns_comment = this.comment.owner_id === this.jwt_service.getUserId();
    if (this.comment.inner_comment_count) {
      this.getComments(false);
    }
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
    if (!this.showResponse) {
      this.showResponse = true;
      setTimeout(() => {
        this.responseScroll.nativeElement.scrollIntoView();
      }, 200);
    } else {
      this.showResponse = !this.showResponse;
    }
  }

  getComments(reset: boolean, page = this.page, limit = this.limit) {
    this.comments_in_comment_service
      .getInnerComments(this.comment._id, page, limit)
      .subscribe(
        (res: any) => {
          console.log(res);
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
          this.inner_comment_media_locator,
          this.inner_comment_creation_media_type
        )
        .subscribe(
          (res) => {
            this.comment_in_comment = '';
            const {
              _id,
              description,
              media_locator,
              media_type,
              owner_id,
              created_at,
              owner,
            } = res.data.createInnerComment;
            this.commentsInComment = [
              ...this.commentsInComment,
              {
                _id,
                comment_id: this.comment._id,
                owner,
                description,
                media_locator,
                media_type,
                owner_id,
                created_at,
              },
            ];
            this.inner_comment_media_locator = '';
            this.loaded_media = false;
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
    this.limit = 2;
    this.page += 1;
    this.getComments(false);
  }

  resetComments() {
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
        .editComment(
          this.comment._id,
          this.description,
          this.shown_media,
          this.shown_media_type
        )
        .subscribe((res: any) => {
          this.comment_updating = false;
          this.description = res.data.updateComment.description;
          this.setMedia(
            res.data.updateComment.media_locator,
            res.data.updateComment.media_type
          );
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

  public uploadCommentImage(file: File, comment_type: string) {
    this.ready_to_send = false;
    this.media_service.uploadImage(file).subscribe((res) => {
      console.log(res);
      if (comment_type === 'inner') {
        this.inner_comment_media_locator = res.media_locator;
        this.inner_comment_creation_media_file = res.media_locator;
        this.inner_comment_creation_media_type = res.contentType;
        this.loaded_media = true;
      } else {
        this.media_locator = res.media_locator;
        this.shown_media = res.media_locator;
        this.shown_media_type = res.contentType;
      }
      this.ready_to_send = true;
    });
  }

  public uploadCommentVideo(file: File, comment_type: string) {
    this.ready_to_send = false;
    this.media_service.uploadVideo(file).subscribe((res) => {
      if (comment_type === 'inner') {
        this.inner_comment_media_locator = `${res.media_locator} ${res.contentType}`;
        this.inner_comment_creation_media_file = res.media_locator;
        this.inner_comment_creation_media_type = res.contentType;
        this.loaded_media = true;
      } else {
        this.media_locator = `${res.media_locator} ${res.contentType}`;
        this.shown_media = res.media_locator;
        this.shown_media_type = res.contentType;
      }
      this.ready_to_send = true;
    });
  }

  public handleFileInput(event: any, comment_type?: string) {
    this.file_to_upload = event.target.files[0];
    if (this.file_to_upload.type.startsWith('video')) {
      this.uploadCommentVideo(this.file_to_upload, comment_type);
    } else if (this.file_to_upload.type.startsWith('image')) {
      this.uploadCommentImage(this.file_to_upload, comment_type);
    }
  }

  public setMedia(media: string, type: string) {
    this.media_locator_image = media;
    this.media_type = type;
  }
}
