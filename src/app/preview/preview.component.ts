import { Component, inject } from '@angular/core';
import { ELEMENTDATAService } from '../@services/element-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestService } from '../@services/quest.service';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-preview',
  imports: [CommonModule, FormsModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss',
})
export class PreviewComponent {
  constructor(
    private elementData: ELEMENTDATAService,
    private questService: QuestService,
    private router: Router,
    private dialog: MatDialog,
  ) {}
  private _snackBar = inject(MatSnackBar);
  dataArray: any;
  questData: any;
  questArray: any[] = [];
  ngOnInit(): void {
    if (!this.questService.questData) {
      this.router.navigateByUrl('questionnaire');
    }
    this.questData = this.questService.questData;
  }
  toQuest() {
    this.router.navigateByUrl('questionnaire');
  }

  toSubmit() {
    this._snackBar.open('問卷繳交成功', '關閉',{duration:2000});
    this.router.navigateByUrl('');
  }
}
