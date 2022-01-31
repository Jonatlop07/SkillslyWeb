import { PostCollectionModel } from "../../../models/post_collection.model";
import { PostReaction } from '../../../interfaces/post/post_reaction'

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

export class AddReactionToPost {
  static readonly type = '[Post Query] Add Reaction To Post';

  constructor(public readonly reaction: PostReaction) {
  }
}

export class RemoveReactionFromPost {
  static readonly type = '[Post Query] Remove Reaction From Post';

  constructor(public readonly reaction: PostReaction) {
  }
}

