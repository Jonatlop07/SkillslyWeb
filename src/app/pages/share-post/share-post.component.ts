import { Component } from '@angular/core';
import { PostService } from '../../services/posts.service';
import { SharePostInterface } from '../../interfaces/share_post.interface';
import { Select } from '@ngxs/store'
import { SessionState } from '../../shared/state/session/session.state'
import { Observable } from 'rxjs'
import { SessionModel } from '../../models/session.model'

@Component({
  selector: 'app-share-post',
  templateUrl: './share-post.component.html',
  styleUrls: ['./share-post.component.css']
})
export class SharePostComponent {

  public post_id = '036e19fd-04f5-4de5-8c2c-c0b584516256';

  constructor(private postService: PostService) {
  }

  sharePost() {
    const sharePostInterface: SharePostInterface = {
      post_id: this.post_id
    };
    this.postService.sharePost(sharePostInterface)
      .subscribe(resp => console.log(resp));
  }
}
