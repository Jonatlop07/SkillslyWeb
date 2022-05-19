import { Component, Input } from '@angular/core'
import * as moment from 'moment'
import StoryResponse from '../../types/story'

@Component({
  selector: 'skl-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css'],
})
export class StoryComponent {

  displayModal: boolean;

  @Input()
  storyElements: Array<StoryResponse>;

  isImageReference() {
    return true;
  }

  getTime() {
    moment.locale('es');
    return moment(this.storyElements[0].created_at).fromNow();
  }

  showModalDialog() {
    this.displayModal = true;
  }

  validateDate() {
    const expires_date = moment(this.storyElements[0].created_at).add(1, 'days');
    return moment().isBefore(expires_date);
  }
}
