import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle, } from '@angular/material/dialog';
  import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-dialog',
  imports: [MatDialogModule,MatButtonToggleModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string,title?:string,showCancel?: boolean }
  ) {
    // 把 data.showCancel 傳進來
    if (data.showCancel === false) {
      this.showCancel = false;
    }
  }
  showCancel: boolean = true;

  onCancel(){
    this.dialogRef.close(false)
  }

  onConfirm(){
    this.dialogRef.close(true)
  }

}
