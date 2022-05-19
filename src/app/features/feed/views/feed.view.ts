import { Component, HostListener, OnInit } from '@angular/core';
import { PostService } from '../../post/services/posts.service';
import {PermanentPostPresenter, QueryPostPresenter} from '../../post/types/query_post.presenter';
import {SetMyPosts} from "../../../shared/state/posts/posts.actions";
import {JwtService} from "../../../core/service/jwt.service";
import {Select, Store} from "@ngxs/store";
import {MyPostsState} from "../../../shared/state/posts/posts.state";
import {Observable} from "rxjs";
import {PostCollectionModel, PostModel} from "../../post/model/post_collection.model";

@Component({
  selector: 'skl-feed',
  templateUrl: './feed.view.html',
  styleUrls: ['./feed.view.css'],
})
export class FeedView implements OnInit {
  public foundPosts: PermanentPostPresenter[];
  public owner_name: string;
  @Select(MyPostsState) my_posts$: Observable<PostCollectionModel>;
  public posts: Array<PostModel>;
  // public limitPost: number;
  // public offsetPost: number;

  constructor(private postService: PostService,
              private readonly jwt_service: JwtService,
              private readonly store: Store) {}

  ngOnInit(): void {
    // this.limitPost = 15;
    // this.offsetPost = 0;
    // const postServiceResponse = this.postService.getPostsOfFriendsCollection(
    //   this.limitPost,
    //   this.offsetPost
    // );
    // postServiceResponse.subscribe((res: any) => {
    //   this.foundPosts = res.posts;
    //   this.offsetPost = this.offsetPost + this.limitPost;
    // });
    const queryPostParams: QueryPostPresenter = {
      owner_id: this.jwt_service.getUserId(),
    };
    this.postService
      .getPostCollection(queryPostParams)
      .subscribe(({ data }) => {
        this.store.dispatch(new SetMyPosts({ posts: data.postsByOwnerId.posts }));
        this.my_posts$.subscribe((my_posts) => {
          this.posts = my_posts.posts;
        });
        this.owner_name = data.postsByOwnerId.owner.name;
      });
  }

  // @HostListener('window:scroll', ['$event'])
  // public onScroll(): void {
  //   const pos =
  //     (document.documentElement.scrollTop || document.body.scrollTop) + 1300;
  //   const max =
  //     document.documentElement.scrollHeight || document.body.scrollHeight;
  //   if (pos > max) {
  //     if (!this.postService.isChargingFeedPosts) {
  //       const postServiceResponse =
  //         this.postService.getPostsOfFriendsCollection(
  //           this.limitPost,
  //           this.offsetPost
  //         );
  //       postServiceResponse.subscribe((resp: any) => {
  //         this.foundPosts.push(...resp.posts);
  //         this.offsetPost = this.offsetPost + this.limitPost;
  //       });
  //     }
  //   }
  // }
}
