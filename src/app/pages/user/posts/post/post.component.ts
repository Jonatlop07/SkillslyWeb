import { Component, Input, OnInit } from '@angular/core';
import { DeletePostInterface } from 'src/app/interfaces/delete_post.interface';
import { Comment } from 'src/app/interfaces/presenter/comment.presenter';
import { PermanentPostPresenter } from 'src/app/interfaces/presenter/query_post.presenter';
import { CommentsService } from 'src/app/services/comments.service';
import { PostService } from 'src/app/services/posts.service';
import { Router, ActivatedRoute } from '@angular/router';

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

  constructor(private commentsService: CommentsService, private router: Router, private activatedRoute: ActivatedRoute, private postService: PostService) { }

  ngOnInit(): void {
    this.getComments();
  }

  isImage(referenceType: string): boolean {
    if (referenceType == 'imagen') {
      return true;
    }
    return false;
  }

  handleShowComments() {
    this.showComments = !this.showComments;
  }

  deletePost(post_id: string) {
    const deletePostInterface: DeletePostInterface = {
      post_id,
    }
    const postServiceResponse = this.postService.deletePost(deletePostInterface);
    postServiceResponse.subscribe(resp => {
      console.log(resp),
        window.location.reload()
    });
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
    this.getComments();
    this.page += 1;
  }

  resetComments() {
    this.page -= 1;
    if (this.page === 0) {
      this.limit = 2;
    } else {
      this.limit = 10;
    }
    this.getComments();
  }

  getComments(page = this.page, limit = this.limit) {
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
  }
}
