import {Component, OnInit} from '@angular/core';
import {TweetService} from '../_services';
import {Tweet} from '../_models';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.less']
})
export class TweetListComponent implements OnInit {
  tweets$: BehaviorSubject<Tweet[]>;

  constructor(private tweetService: TweetService) {
  }

  ngOnInit(): void {
    this.tweets$ = this.tweetService.tweets$;
  }
}
