import {
  Component, Input, OnInit,
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Toot} from '../_models';
import {TootService, UserService} from '../_services';
import {DeleteDialogComponent} from '../delete-dialog/delete-dialog.component';
import URI from 'urijs';

@Component({
  selector: 'app-toot-card',
  templateUrl: './toot-card.component.html',
  styleUrls: ['./toot-card.component.less']
})
export class TootCardComponent implements OnInit {
  @Input() toot: Toot;
  public isDeleting: boolean;
  public isLoggedIn: boolean;

  constructor(
    private tootService: TootService,
    private userService: UserService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.userService.getLoginAsObservable().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  formatBodyText(text) {
    return URI.withinString(text, (s) => {
      let url = URI(s); // May not have protocol
      if (!url.protocol()) {
        url = URI(`https://${s}`); // Defaulting
      }
      return `<a
        href="${url.href()}"
        rel="nofollow"
        target="_blank">${s}</a>`;
    });
  }

  onDelete() {
    this.dialog.open(DeleteDialogComponent, {
      data: {
        tootId: this.toot.id
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        switch (result.status) {
          case 'Success':
            this.isDeleting = true;
            break;
          case 'Failure':
            this.isDeleting = false;
            break;
        }
      }
    });
  }
}
