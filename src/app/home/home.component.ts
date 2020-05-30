import {Component, OnInit} from '@angular/core';
import {TootService} from '../_services';
import {Toot} from '../_models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  toots: Toot[];

  constructor(private tootService: TootService) {
  }

  ngOnInit(): void {
    this.tootService.fetchToots();
  }

}
