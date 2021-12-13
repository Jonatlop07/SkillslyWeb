import { Component, HostListener, OnInit } from '@angular/core';
import { PermanentPostPresenter } from 'src/app/interfaces/presenter/post/query_post.presenter';
import { PostService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  public foundPosts: PermanentPostPresenter[];
  public limit: number;
  public offset: number; 

  constructor (
    private postService: PostService
  ) {}

  ngOnInit (): void {
    this.limit = 15; 
    this.offset = 0; 
    const postServiceResponse = this.postService.getPostsOfFriendsCollection(this.limit,this.offset);
    postServiceResponse.subscribe((res: any) => {
      console.log(this.offset)
      console.log(res)
      this.foundPosts = res.posts;
      this.offset = this.offset + this.limit; 
    });
  }
  
  @HostListener('window:scroll', ['$event'])
  onScroll () {
    const pos = (document.documentElement.scrollTop || document.body.scrollTop ) + 1300;
    const max = ( document.documentElement.scrollHeight || document.body.scrollHeight );
    if ( pos > max ) {
      if ( !this.postService.isChargingFeedPosts ) { 
        const postServiceResponse = this.postService.getPostsOfFriendsCollection(this.limit, this.offset);
        postServiceResponse.subscribe( (resp:any) => {
          console.log(this.offset)
          console.log(resp)
          this.foundPosts.push(...resp.posts );
          this.offset = this.offset + this.limit; 
        }); 
      }
    }
  }
}
