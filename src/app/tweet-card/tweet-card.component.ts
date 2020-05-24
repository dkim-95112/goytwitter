import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {Tweet} from '../_models';
import {TweetService} from '../_services';

@Component({
  selector: 'app-tweet-card',
  templateUrl: './tweet-card.component.html',
  styleUrls: ['./tweet-card.component.less']
})
export class TweetCardComponent {
  @Input() toot: Tweet;

  constructor(private tweetService: TweetService) {
  }

  onEdit() {
    console.log('onEdit');
  }

  onDelete() {
    console.log('onDelete');
    this.tweetService.delete(this.toot.id);
  }
}
