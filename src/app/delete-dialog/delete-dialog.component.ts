import {Component, Inject} from '@angular/core';
import {TootService} from '../_services';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  templateUrl: './delete-dialog.component.html',
})

export class DeleteDialogComponent {
  public submitErrorMessages: string[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: {
      tootId: string
    },
    private dialogRef: MatDialogRef<DeleteDialogComponent>,
    private tootService: TootService,
  ) {
  }

  onDelete() {
    this.tootService.delete(this.data.tootId).subscribe(
      resp => {
        console.log('delete toot svc received: %o', resp);
        if (resp.status) {
          switch (resp.status) {
            case 'Success':
              this.dialogRef.close(resp);
              break;
            case 'Failure':
              this.submitErrorMessages = resp.messages;
              break;
          }
        }
      },
      err => {
        console.error('delete toot svc: %o', err);
        this.submitErrorMessages = [err.message];
      },
      () => {
        console.log('delete toot svc complete');
      }
    );
  }
}
