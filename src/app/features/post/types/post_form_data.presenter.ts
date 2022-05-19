import {
  PostContentElement,
} from './create_post_data.presenter';

export function toPostContent(post_content: Array<PostContentElement>) {
  const postsWithoutNullValues: PostContentElement[] = [];
  for (const content of post_content) {
    Object.keys(content).forEach((key) => {
      if (
        content[key as keyof PostContentElement] === null ||
        content[key as keyof PostContentElement] === ''
      ) {
        delete content[key as keyof PostContentElement];
      }
    });
    postsWithoutNullValues.push(content);
  }
  return postsWithoutNullValues;
}
