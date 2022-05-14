import { Component } from '@angular/core'
import { QueryPostPresenter} from '../../types/query_post.presenter'
import { ActivatedRoute } from '@angular/router'
import { PostCollectionModel, PostModel } from '../../model/post_collection.model'
import { PostService } from '../../services/posts.service'
import { SharePostInterface } from '../../types/share_post.interface'
import { Select, Store } from '@ngxs/store'
import { SetMyPosts } from '../../../../shared/state/posts/posts.actions'
import { Observable } from 'rxjs'
import { MyPostsState } from '../../../../shared/state/posts/posts.state'

@Component({
  selector: 'skl-user-post-collection-view',
  templateUrl: './user_post_collection.view.html',
  styleUrls: ['./user_post_collection.view.css']
})
export class UserPostCollectionView {

  public post_owner: string;
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
      this.post_owner = params.id;
      const queryPostParams: QueryPostPresenter = {
        owner_id: this.post_owner,
      };
      this.postService
        .getPostCollection(queryPostParams)
        .subscribe(({data}) => {
          this.store.dispatch(new SetMyPosts({ posts: data.postsByOwnerId }));
          this.my_posts$.subscribe(my_posts => {
            this.posts = my_posts.posts;
          })
        });
    })
  }

  sharePost(post_id: string): void {
    const sharePostInterface: SharePostInterface = {
      id: post_id
    };
    this.postService
      .sharePost(sharePostInterface)
      .subscribe();
  }
}
