import {Component, OnInit} from '@angular/core';
import {TweetService} from '../_services';
import {Tweet} from '../_models';

@Component({
  selector: 'app-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.less']
})
export class TweetListComponent implements OnInit {
  toots: Tweet[];
  constructor(private tweetService: TweetService) {
  }

  ngOnInit(): void {
    this.tweetService.getToots()
      .subscribe((toots) => {
        this.toots = toots;
      });
  }
}
