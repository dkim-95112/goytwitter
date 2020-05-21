import {Component, OnInit} from '@angular/core';
import {TweetService} from '../_services';

@Component({
  selector: 'app-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.less']
})
export class TweetListComponent implements OnInit {
  constructor(public tweetService: TweetService) {
  }

  ngOnInit(): void {
  }
}
