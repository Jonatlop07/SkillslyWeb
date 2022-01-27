import { PostCollectionModel } from "../../../models/post_collection.model";

export class SetMyPosts {
  static readonly type = '[Posts Query] Set My Posts';

  constructor(public readonly posts: PostCollectionModel) {
  }
}

export class DeleteMyPost {
  static readonly type = '[Posts Query] Delete My Post';

  constructor(public readonly post_id: string) {
  }
}
