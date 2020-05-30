import {Component, Input, OnInit} from '@angular/core';
import {TootService} from '../_services';
import {Toot} from '../_models';

@Component({
  selector: 'app-toot-list',
  templateUrl: './toot-list.component.html',
  styleUrls: ['./toot-list.component.less']
})
export class TootListComponent implements OnInit {
  toots: Toot[];

  constructor(public tootService: TootService) {
  }

  ngOnInit(): void {
    this.tootService.getTootsObservable().subscribe(
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
