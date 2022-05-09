import { PostCollectionModel } from '../../../features/post/model/post_collection.model'
import { AddReactionToPost, DeleteMyPost, RemoveReactionFromPost, SetMyPosts } from './posts.actions'
import { Injectable } from '@angular/core'
import { Action, State, StateContext, StateToken } from '@ngxs/store'

const POSTS_STATE_TOKEN = new StateToken<PostCollectionModel>('my_posts');

@Injectable({
  providedIn: 'root'
})
@State<PostCollectionModel>({
  name: POSTS_STATE_TOKEN,
  defaults: { posts: [] }
})
export class MyPostsState {
  @Action(SetMyPosts)
  public setMyPosts(ctx: StateContext<PostCollectionModel>, action: SetMyPosts) {
    ctx.setState({
      ...action.posts
    });
  }

  @Action(DeleteMyPost)
  public deleteMyPost(ctx: StateContext<PostCollectionModel>, action: DeleteMyPost) {
    const state = ctx.getState();
    ctx.setState({
      posts: state.posts.filter(post => post.post_id !== action.post_id)
    });
  }

  @Action(AddReactionToPost)
  public addReactionToPost(ctx: StateContext<PostCollectionModel>, action: AddReactionToPost) {
  }

  @Action(RemoveReactionFromPost)
  public removeReactionFromPost(ctx: StateContext<PostCollectionModel>, action: RemoveReactionFromPost) {

  }
}
