import { CommonModule } from '@angular/common';
import {
  Component,
  QueryList,
  ElementRef,
  ViewChildren,
  ChangeDetectorRef,
  Type,
  inject,
} from '@angular/core';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-questionnaire',
  imports: [CommonModule, FormsModule, MatDialogModule, MatIconModule,MatTooltipModule,RouterLink],
  templateUrl: './add-questionnaire.component.html',
  styleUrl: './add-questionnaire.component.scss',
})
export class AddQuestionnaireComponent {
  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef,private router:Router) {};
  private _snackBar = inject(MatSnackBar);
  today: string = new Date().toISOString().split('T')[0];
  questions = [
    {
      title: '',
      startTime: this.today,
      endTime: '',
      desc: '',
      questArray: [{ type: '', questName: '', options: [''] }],
    },
  ];
  errorMessages: string[] = [];

  @ViewChildren('optionInput') optionInputs!: QueryList<ElementRef>;

  //新增題目/選項
  addQuestion() {
    this.questions[0].questArray.push({
      questName: '',
      type: '',
      options: [''],
    });
  }

  onTypeChange(qIndex: number) {
    const current = this.questions[0].questArray[qIndex];
    if (current.type === 'single' || current.type === 'multiple') {
      console.log(current.options.length);
      if (current.options.length === 1) {
        this.focusFirstOption(qIndex);
      } else if (current.options.length > 1) {
        this.focusLastOption(qIndex);
      }
    }
  }

  focusFirstOption(qIndex: number) {
    setTimeout(() => {
      const inputs = this.optionInputs.toArray();
      const offset = this.questions[0].questArray
        .slice(0, qIndex) // 取前面所有題目
        .reduce((sum, q) => sum + q.options.length, 0); // 計算總選項數

      const firstInput = inputs[offset];

      firstInput?.nativeElement.focus();
    }, 0);
  }

  focusLastOption(qIndex: number) {
    setTimeout(() => {
      const inputs = this.optionInputs.toArray();
      const offset = this.questions[0].questArray
        .slice(0, qIndex + 1) // 包含當前題目
        .reduce((sum, q) => sum + q.options.length, 0); // 總選項數
      const lastInput = inputs[offset - 1];
      lastInput?.nativeElement.focus();
    }, 0);
  }

  addOption(qIndex: number) {
    this.questions[0].questArray[qIndex].options.push('');
    setTimeout(() => {
      const inputs = this.optionInputs.toArray();
      const lastInput = inputs[inputs.length - 1];
      lastInput?.nativeElement.focus();
    }, 0);
  }

  //刪除題目/選項
  removeQuestion(index: number) {
    if (this.questions[0].questArray.length > 1) {
      this.questions[0].questArray.splice(index, 1);
    } else {
      this.dialog.open(DialogComponent, {
        data: { message: '請至少保留一題', title: '提示', showCancel: false },
      });
    }
  }

  removeOption(qIndex: number, optIndex: number) {
    if (this.questions[0].questArray[qIndex].options.length > 1) {
      this.questions[0].questArray[qIndex].options.splice(optIndex, 1);
      this.focusLastOption(qIndex);
    } else {
      this.dialog.open(DialogComponent, {
        data: {
          message: '請至少保留一個選項',
          title: '提示',
          showCancel: false,
        },
      });
    }
  }

  errorMessagesMap: {
    [key: string]: any;
    questionsError?: {
      [index: number]: {
        [key: string]: string;
      };
    };
  } = {};

  errorLabels = {
    title: '請輸入問卷標題',
    startTime: '請選擇問卷的開始日期',
    endTime: '請選擇問卷的結束日期',
    questName:'題目未填寫',
    type:'題型未選擇',
    options:'請至少有兩個有效選項'
  }as const;

  //驗證表單
  validateForm(): boolean {
    this.errorMessages = [];
    this.errorMessagesMap = {
      title: '',
      startTime: '',
      endTime: '',
      questionsError: {},
    };
    this.errorAnimationMap.questions = {};

    const form = this.questions[0];

    // 檢查標題
    if (!form.title.trim()) {
      this.errorMessagesMap['title'] = this.errorLabels.title;
      this.errorMessages.push(this.errorLabels.title);
      this.showFieldError('title');
    }

    //檢查日期
    if (!form.startTime) {
      this.errorMessagesMap['startTime'] = this.errorLabels.startTime;
      this.errorMessages.push(this.errorLabels.startTime);
      this.showFieldError('startTime');
    }
    if (!form.endTime) {
      this.errorMessagesMap['endTime'] = this.errorLabels.endTime;
      this.errorMessages.push(this.errorLabels.endTime);
      this.showFieldError('endTime');
    }

    //檢查題目&選項
    form.questArray.forEach((item, index) => {
      const errors: { [key: string]: string } = {};

      if (!item.questName.trim()) {
        errors['questName'] = this.errorLabels.questName;
        this.errorMessages.push(this.errorLabels.questName);
        this.showErrorAnimation(index, 'questName');
      }

      if (!item.type) {
        errors['type'] = this.errorLabels.type;
        this.errorMessages.push(this.errorLabels.type);
        this.showErrorAnimation(index, 'type');
      }

      if (item.type === 'single' || item.type === 'multiple') {
        const nonEmptyOption = item.options.filter(
          (option) => option.trim() !== ''
        );
        if (nonEmptyOption.length < 2) {
          errors['options'] = this.errorLabels.options;
          this.errorMessages.push(this.errorLabels.options);
          this.showErrorAnimation(index, 'options');
        }
      }

      if (Object.keys(errors).length > 0) {
        this.errorMessagesMap.questionsError![index] = errors;
      }
    });

    return this.errorMessages.length === 0;
  }

  onSubmit() {
    if (this.validateForm()) {
      // 送出表單
      console.log('送出成功', this.questions[0]);
      this._snackBar.open('問卷新增成功', '關閉',{duration:2000});
      this.router.navigateByUrl('');
    } else {
      console.log('表單有錯', this.errorMessages);
    }
  }

  //題目錯誤提示動畫
  errorAnimationMap: {
    form?: {
      title?: boolean;
      startTime?: boolean;
      endTime?: boolean;
    };
    questions?: {
      [qIndex: number]: {
        [field: string]: boolean;
      };
    };
  } = {};

  //淡入動畫
  showErrorAnimation(qIndex: number, field: string) {
    // 初始化 map（如果還沒建立）
    //確保questions層
    if (!this.errorAnimationMap.questions) {
      this.errorAnimationMap.questions = {};
    }

    //確保欄位物件層
    if (!this.errorAnimationMap.questions[qIndex]) {
      this.errorAnimationMap.questions[qIndex] = {};
    }

    // 關閉動畫 → 立刻刷新 → 再開啟動畫
    this.errorAnimationMap.questions[qIndex][field] = false;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.errorAnimationMap.questions![qIndex][field] = true;
      this.cdr.detectChanges();
    }, 50);
  }

  //淡出動畫
  clearQuestionError(qIndex: number, field: string) {
    if (this.errorMessagesMap.questionsError?.[qIndex]?.[field]) {
      // 先將動畫狀態設為 false（讓 .show 拿掉，觸發淡出）
      this.errorAnimationMap.questions![qIndex][field] = false;
      this.cdr.detectChanges();

      // 等動畫跑完再真正移除錯誤訊息
      setTimeout(() => {
        delete this.errorMessagesMap.questionsError![qIndex][field];
        this.cdr.detectChanges();
      }, 300); // 這裡要配合你的 CSS transition 時間（例如 0.3s）
    }
  }

  //控制動畫
  handleQuestionInput(qIndex: number, field: keyof typeof this.errorLabels, value: string) {
    const isEmpty = value.trim() === '';

    if (isEmpty) {
      // 還沒存在錯誤就加上去
      if (!this.errorMessagesMap.questionsError?.[qIndex]?.[field]) {
        if (!this.errorMessagesMap.questionsError) {
          this.errorMessagesMap.questionsError = {};
        }
        if (!this.errorMessagesMap.questionsError[qIndex]) {
          this.errorMessagesMap.questionsError[qIndex] = {};
        }

        this.errorMessagesMap.questionsError[qIndex][field] = this.errorLabels[field];
        this.showErrorAnimation(qIndex, field);
      }
    } else {
      this.clearQuestionError(qIndex, field); // 執行淡出移除
    }
  }

  handleOptionInput(qIndex: number, field: keyof typeof this.errorLabels){
    const form = this.questions[0];
    form.questArray.forEach((item,index)=>{
      if (item.type === 'single' || item.type === 'multiple') {
        const nonEmptyOption = item.options.filter(
          (option) => option.trim() !== ''
        );
        if (nonEmptyOption.length < 2) {
          if (!this.errorMessagesMap.questionsError?.[qIndex]?.[field]) {
            if (!this.errorMessagesMap.questionsError) {
              this.errorMessagesMap.questionsError = {};
            }
            if (!this.errorMessagesMap.questionsError[qIndex]) {
              this.errorMessagesMap.questionsError[qIndex] = {};
            }

            this.errorMessagesMap.questionsError[qIndex][field] = this.errorLabels[field];
            this.showErrorAnimation(qIndex, field);
          }
        } else {
          this.clearQuestionError(qIndex, field); // 執行淡出移除
        }}
    })
   }


  //標題、時間錯誤提示動畫(無index)

  //淡入動畫
  showFieldError(field: 'title' | 'startTime' | 'endTime') {
    // 初始化 map（如果還沒建立）
    //確保questions層
    if (!this.errorAnimationMap.form) {
      this.errorAnimationMap.form = {};
    }

    this.errorAnimationMap.form[field] = false;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.errorAnimationMap.form![field] = true;
      this.cdr.detectChanges();
    }, 50);
  }

  //淡出動畫
  clearFieldError(field: 'title' | 'startTime' | 'endTime') {
    if (this.errorMessagesMap[field]) {
      // 先將動畫狀態設為 false（讓 .show 拿掉，觸發淡出）
      this.errorAnimationMap.form![field] = false;
      this.cdr.detectChanges();

      // 等動畫跑完再真正移除錯誤訊息
      setTimeout(() => {
        delete this.errorMessagesMap![field];
        this.cdr.detectChanges();
      }, 300); // 這裡要配合你的 CSS transition 時間（例如 0.3s）
    }
  }

  //動畫控制
  handleFieldInput(field: 'title' | 'startTime' | 'endTime', value: string) {
    const isEmpty = value.trim?.() === '' || !value;

    if (isEmpty) {
      if (!this.errorMessagesMap[field]) {
        this.errorMessagesMap[field] = this.errorLabels[field]
        this.showFieldError(field);
      }
    } else {
      this.clearFieldError(field); // 執行淡出移除動畫
    }
  }


}
