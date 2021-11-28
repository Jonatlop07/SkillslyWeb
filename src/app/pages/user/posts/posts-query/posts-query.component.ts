import { Component, OnInit } from '@angular/core';
import {
  PermanentPostPresenter,
  QueryPostPresenter,
} from 'src/app/interfaces/presenter/query_post.presenter';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/posts.service';
import { SharePostInterface } from 'src/app/interfaces/share_post.interface';

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
<<<<<<< HEAD
    const postServiceResponse =
      this.postService.queryPostCollection(queryPostParams);
    postServiceResponse.subscribe((res: any) => {
      this.foundPosts = res.posts;
    });
  }

}
=======
    const postServiceResponse = this.postService.queryPostCollection(queryPostParams);
    postServiceResponse.subscribe((res:any) => {
      this.foundPosts=res.posts;
    });
  }

  sharePost(post_id: string) : void {
    const sharePostInterface: SharePostInterface = {
      post_id: post_id, 
      user_id: localStorage.getItem('id')
    }
    const postResponse = this.postService.sharePost(sharePostInterface);
    postResponse.subscribe(resp => console.log(resp));  
  }

  isImage(referenceType: string): boolean {
    if (referenceType =='image'){
      return true;
    }
    return false;
  }

}
>>>>>>> 8fd3a64cd6a7b1a1c1f558a8b6038bf7dc9322bf
