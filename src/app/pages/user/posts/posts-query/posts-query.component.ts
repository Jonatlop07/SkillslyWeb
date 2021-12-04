import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/posts.service';
import { SharePostInterface } from 'src/app/interfaces/share_post.interface';
import { PermanentPostPresenter, QueryPostPresenter } from '../../../../interfaces/presenter/post/query_post.presenter'


@Component({
  selector: 'app-posts-query',
  templateUrl: './posts-query.component.html',
  styleUrls: ['./posts-query.component.css'],
})
export class PostsQueryComponent implements OnInit {
  public searchPost: string;
  public userName: string;
  public foundPosts: PermanentPostPresenter[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.searchPost = params.searchPost;
      const queryPostParams: QueryPostPresenter = {
        user_id: this.searchPost,
      };
      const postServiceResponse = this.postService.queryPostCollection(queryPostParams);
      postServiceResponse.subscribe((res: any) => {
        this.foundPosts = res.posts;
      });
    })
  }

  sharePost(post_id: string): void {
    const sharePostInterface: SharePostInterface = {
      post_id: post_id,
      user_id: localStorage.getItem('id')
    }
    const postResponse = this.postService.sharePost(sharePostInterface);
    postResponse.subscribe(resp => console.log(resp));
  }

  isImage(referenceType: string): boolean {
    if (referenceType == 'imagen') {
      return true;
    }
    return false;
  }
}
