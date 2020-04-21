import {Component, OnInit} from '@angular/core';
import {TweetService} from '../_services';
import {Tweet} from '../_models';

@Component({
  selector: 'app-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.less']
})
export class TweetListComponent implements OnInit {
  tweets: Tweet[];

  constructor(private tweetService: TweetService) {
  }

  ngOnInit(): void {
    this.tweetService.getTweets()
      .subscribe(x => {
        this.tweets = x;
      });
  }
}
