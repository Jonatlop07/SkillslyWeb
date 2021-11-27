import {
  CreatePostDataPresenter,
  PostContentData,
} from './create_post_data.presenter';

export function toPost(post: CreatePostDataPresenter) {
  const postsWithoutNullValues: PostContentData[] = [];
  for (const content of post.content) {
    Object.keys(content).forEach((key) => {
      if (
        content[key as keyof PostContentData] === null ||
        content[key as keyof PostContentData] === ''
      ) {
        delete content[key as keyof PostContentData];
      }
    });
    postsWithoutNullValues.push(content);
  }
  return postsWithoutNullValues;
}
