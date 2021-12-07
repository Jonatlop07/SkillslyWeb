import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/posts.service';
import { SharePostInterface } from 'src/app/interfaces/share_post.interface';
import { QueryPostPresenter } from '../../../../interfaces/presenter/post/query_post.presenter'
import {Select, Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {MyPostsState} from "../../../../shared/state/posts/posts.state";
import {PostsModel, PostModel} from "../../../../models/posts.model";
import {SetMyPosts} from "../../../../shared/state/posts/posts.actions";


@Component({
  selector: 'app-posts-query',
  templateUrl: './posts-query.component.html',
  styleUrls: ['./posts-query.component.css'],
})
export class PostsQueryComponent implements OnInit {
  public post_owner: string;
  public userName: string;
  @Select(MyPostsState) my_posts$: Observable<PostsModel>;
  public posts: Array<PostModel>

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private readonly store: Store
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.post_owner = params.user_id;
      const queryPostParams: QueryPostPresenter = {
        user_id: this.post_owner,
      };
      const postServiceResponse = this.postService.queryPostCollection(queryPostParams);
      postServiceResponse.subscribe((res: any) => {
        this.store.dispatch(new SetMyPosts({posts: res.posts}));
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
    this.postService.sharePost(sharePostInterface)
      .subscribe(resp => console.log(resp));
  }

}
