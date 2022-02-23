import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/posts.service';
import { SharePostInterface } from 'src/app/interfaces/post/share_post.interface';
import { QueryPostPresenter } from '../../../interfaces/post/query_post.presenter'
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { MyPostsState } from "../../../shared/state/posts/posts.state";
import { PostCollectionModel, PostModel } from "../../../models/post_collection.model";
import { SetMyPosts } from "../../../shared/state/posts/posts.actions";


@Component({
  selector: 'app-posts-query',
  templateUrl: './posts-query.component.html',
  styleUrls: ['./posts-query.component.css'],
})
export class PostsQueryComponent implements OnInit {

  public post_owner: string;
  public userName: string;
  @Select(MyPostsState) my_posts$: Observable<PostCollectionModel>;
  public posts: Array<PostModel>

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private readonly store: Store
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.post_owner = params.user_id;
      const queryPostParams: QueryPostPresenter = {
        owner_id: this.post_owner,
      };
      this.postService
        .queryPostCollection(queryPostParams)
        .subscribe((res: any) => {
          this.store.dispatch(new SetMyPosts({ posts: res.posts }));
          this.my_posts$.subscribe(my_posts => {
            this.posts = my_posts.posts;
          })
        });
    })
  }

  sharePost(post_id: string): void {
    const sharePostInterface: SharePostInterface = {
      post_id: post_id
    };
    this.postService
      .sharePost(sharePostInterface)
      .subscribe(() => {});
  }
}
