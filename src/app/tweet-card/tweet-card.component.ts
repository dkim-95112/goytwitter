import {Component, Input, OnInit} from '@angular/core';
import {Tweet} from '../tweet';

@Component({
  selector: 'tweet-card',
  templateUrl: './tweet-card.component.html',
  styleUrls: ['./tweet-card.component.less']
})
export class TweetCardComponent implements OnInit {
  @Input() tweet: Tweet;

  constructor() {
  }

  ngOnInit(): void {
  }

}
