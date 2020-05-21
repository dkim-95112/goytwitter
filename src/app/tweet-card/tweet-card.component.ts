import {Component, Input, OnInit} from '@angular/core';
import {Tweet} from '../_models';
import {TweetService} from '../_services';

@Component({
  selector: 'app-tweet-card',
  templateUrl: './tweet-card.component.html',
  styleUrls: ['./tweet-card.component.less']
})
export class TweetCardComponent implements OnInit {
  @Input() tweet: Tweet;

  constructor(private tweetService: TweetService) {
  }

  ngOnInit(): void {
  }

  onEdit() {
    console.log('onEdit');
  }

  onDelete() {
    console.log('onDelete');
    this.tweetService.delete(this.tweet.id)
      .subscribe((v) => {
        console.log('component deleting');
      });
  }
}
