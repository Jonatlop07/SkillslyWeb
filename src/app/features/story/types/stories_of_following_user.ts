import StoryResponse from './story'

export default interface StoriesOfFollowingUser {
  friend_id: string;
  stories: Array<StoryResponse>;
}
