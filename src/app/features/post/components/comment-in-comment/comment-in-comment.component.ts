import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import { Comment } from '../../types/comment.presenter'

@Component({
  selector: 'app-comment-in-comment',
  templateUrl: './comment-in-comment.component.html',
  styleUrls: ['./comment-in-comment.component.css'],
})
export class CommentInCommentComponent {
  @Input() comment: Comment;
  showResponse = false;

  transformDate() {
    moment.locale('es');
    return moment(this.comment.timestamp).fromNow();
  }

  viewDate() {
    moment.locale('es');
    return moment(this.comment.timestamp).format('LLL');
  }
}
