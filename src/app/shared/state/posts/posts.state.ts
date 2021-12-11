import {Action, State, StateContext, StateToken} from "@ngxs/store";
import {PostsModel} from "../../../models/posts.model";
import {DeleteMyPost, SetMyPosts} from "./posts.actions";

const POSTS_STATE_TOKEN = new StateToken<PostsModel>('my_post');

@State<PostsModel>({
  name: POSTS_STATE_TOKEN,
  defaults: {posts: []}
})

export class MyPostsState{
  @Action(SetMyPosts)
  public setMyPosts(ctx: StateContext<PostsModel>, action: SetMyPosts){
    ctx.setState({
      ...action.posts
    });
  }

  @Action(DeleteMyPost)
  public deleteMyPost(ctx: StateContext<PostsModel>, action: DeleteMyPost){
    const state = ctx.getState();
    ctx.setState({
      posts : state.posts.filter( post => post.post_id !== action.post_id )
    });
  }

}
