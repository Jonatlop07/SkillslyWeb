import { Component, HostListener, OnInit } from '@angular/core';
import { PermanentPostPresenter } from 'src/app/interfaces/presenter/post/query_post.presenter';
import { EventModel } from 'src/app/models/events.model';
import { EventService } from 'src/app/services/event.service';
import { PostService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  public foundPosts: PermanentPostPresenter[];
  public foundEvents: EventModel[];
  public limitPost: number;
  public offsetPost: number; 
  public limitEvent: number; 
  public offsetEvent: number; 

  constructor (
    private postService: PostService, 
    private eventService: EventService
  ) {}

  ngOnInit (): void {
    this.limitPost = 15; 
    this.offsetPost = 0; 
    this.limitEvent = 15;
    this.offsetEvent = 0;
    const postServiceResponse = this.postService.getPostsOfFriendsCollection(this.limitPost,this.offsetPost);
    postServiceResponse.subscribe((res: any) => {
      this.foundPosts = res.posts;
      this.offsetPost = this.offsetPost + this.limitPost; 
    });
    const eventServiceResponse = this.eventService.getEventsOfFriendsCollection(this.limitEvent, this.offsetEvent);
    eventServiceResponse.subscribe((res: any) => {
      this.foundEvents = res.events;
      this.offsetEvent = this.offsetEvent + this.limitEvent; 
    });
  }
  
  @HostListener('window:scroll', ['$event'])
  onScroll () {
    const pos = (document.documentElement.scrollTop || document.body.scrollTop ) + 1300;
    const max = ( document.documentElement.scrollHeight || document.body.scrollHeight );
    if ( pos > max ) {
      if ( !this.postService.isChargingFeedPosts ) { 
        const postServiceResponse = this.postService.getPostsOfFriendsCollection(this.limitPost, this.offsetPost);
        postServiceResponse.subscribe( (resp:any) => {
          this.foundPosts.push(...resp.posts );
          this.offsetPost = this.offsetPost + this.limitPost; 
        }); 
      }
      if( !this.eventService.isChargingFeedEvents ) {
        const eventServiceResponse = this.eventService.getEventsOfFriendsCollection(this.limitEvent, this.offsetEvent);
        eventServiceResponse.subscribe( (resp:any) => {
          this.foundEvents.push(...resp.events );
          this.offsetEvent = this.offsetEvent + this.limitEvent; 
        }); 
      }
    }
  }
}
