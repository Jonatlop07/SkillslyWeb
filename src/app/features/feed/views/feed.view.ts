import { Component, HostListener, OnInit } from '@angular/core';
import { PostService } from '../../post/services/posts.service';
import { PermanentPostPresenter } from '../../post/types/query_post.presenter';

@Component({
  selector: 'skl-feed',
  templateUrl: './feed.view.html',
  styleUrls: ['./feed.view.css'],
})
export class FeedView implements OnInit {
  public foundPosts: PermanentPostPresenter[];
  public limitPost: number;
  public offsetPost: number;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.limitPost = 15;
    this.offsetPost = 0;
    const postServiceResponse = this.postService.getPostsOfFriendsCollection(
      this.limitPost,
      this.offsetPost
    );
    postServiceResponse.subscribe((res: any) => {
      this.foundPosts = res.posts;
      this.offsetPost = this.offsetPost + this.limitPost;
    });
  }

  @HostListener('window:scroll', ['$event'])
  public onScroll(): void {
    const pos =
      (document.documentElement.scrollTop || document.body.scrollTop) + 1300;
    const max =
      document.documentElement.scrollHeight || document.body.scrollHeight;
    if (pos > max) {
      if (!this.postService.isChargingFeedPosts) {
        const postServiceResponse =
          this.postService.getPostsOfFriendsCollection(
            this.limitPost,
            this.offsetPost
          );
        postServiceResponse.subscribe((resp: any) => {
          this.foundPosts.push(...resp.posts);
          this.offsetPost = this.offsetPost + this.limitPost;
        });
      }
    }
  }
}
