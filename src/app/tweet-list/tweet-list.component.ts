import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Tweet} from '../tweet';

@Component({
  selector: 'app-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.less']
})
export class TweetListComponent implements OnInit {
  tweets: Array<Tweet>;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    /*
    getConfigResponse(): Observable<HttpResponse<Config>> {
  return this.http.get<Config>(
    this.configUrl, { observe: 'response' });
     */
    this.http.get(`/assets/tweets.json`)
      .subscribe((resp: { docs: Array<Tweet> }) => {
        console.log(resp);
        this.tweets = resp.docs;
      });
  }

}
