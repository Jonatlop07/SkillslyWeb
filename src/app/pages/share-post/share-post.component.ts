import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/posts.service';
import { SharePostInterface } from '../../interfaces/share_post.interface';

@Component({
  selector: 'app-share-post',
  templateUrl: './share-post.component.html',
  styleUrls: ['./share-post.component.css']
})
export class SharePostComponent implements OnInit {

  public post_id: string = '036e19fd-04f5-4de5-8c2c-c0b584516256';  

  constructor(private postService: PostService) { }

  ngOnInit(): void {
  }

  sharePost(){
    const sharePostInterface: SharePostInterface = {
      post_id: this.post_id, 
      user_id: localStorage.getItem('id')
    }
    const postResponse = this.postService.sharePost(sharePostInterface);
    postResponse.subscribe(resp => console.log(resp));  
  }

}
