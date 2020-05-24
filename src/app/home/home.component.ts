import {Component, OnInit} from '@angular/core';
import {TweetService} from '../_services';
import {Tweet} from '../_models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  toots: Tweet[];

  constructor(private tweetService: TweetService) {
  }

  ngOnInit(): void {
    this.tweetService.fetchToots();
  }

}
