import {Component, Input, OnInit} from '@angular/core';
import {TweetService} from '../_services';
import {Tweet} from '../_models';

@Component({
  selector: 'app-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.less']
})
export class TweetListComponent implements OnInit {
  toots: Tweet[];

  constructor(public tweetService: TweetService) {
  }

  ngOnInit(): void {
    this.tweetService.getTootsObservable().subscribe(
      toots => {
        this.toots = toots;
      },
      err => {
        console.error('toot-list: %o', err);
      },
      () => {
        console.log('toot-list complete');
      }
    );
  }
}
