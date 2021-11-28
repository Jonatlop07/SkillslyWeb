import { Component, OnInit } from '@angular/core';
import {
  PermanentPostPresenter,
  QueryPostPresenter,
} from 'src/app/interfaces/presenter/query_post.presenter';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-posts-query',
  templateUrl: './posts-query.component.html',
  styleUrls: ['./posts-query.component.css'],
})
export class PostsQueryComponent implements OnInit {
  public userName: string;
  public foundPosts: PermanentPostPresenter[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    const queryPostParams: QueryPostPresenter = {
      user_id: localStorage.getItem('id'),
    };
    const postServiceResponse =
      this.postService.queryPostCollection(queryPostParams);
    postServiceResponse.subscribe((res: any) => {
      this.foundPosts = res.posts;
    });
  }

}