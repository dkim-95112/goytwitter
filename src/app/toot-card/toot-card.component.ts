import {
  Component, Input, OnInit,
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Toot} from '../_models';
import {TootService, UserService} from '../_services';
import {DeleteDialogComponent} from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-toot-card',
  templateUrl: './toot-card.component.html',
  styleUrls: ['./toot-card.component.less']
})
export class TootCardComponent implements OnInit {
  @Input() toot: Toot;
  public isDeleting: boolean;
  public isLoggedIn: boolean;
  private regexLink = `(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)`

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

    return text;
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
