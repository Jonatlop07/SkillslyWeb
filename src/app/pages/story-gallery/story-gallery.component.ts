import { Component, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  templateUrl: './story-gallery.component.html',
  selector: 'app-story-gallery',
})
export class StoryGalleryComponent {
  @Input()
  images: any[];

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  getPostTime(time: string) {
    moment.locale('es');
    return moment(time).format('LLL');
  }

  validatePostTime(post: any) {
    return moment().isBetween(post.created_at, post.expires_at);
  }
}
