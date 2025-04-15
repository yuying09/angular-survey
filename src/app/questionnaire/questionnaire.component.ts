import { Component } from '@angular/core';
import { ELEMENTDATAService } from '../@services/element-data.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuestService } from '../@services/quest.service';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';


@Component({
  selector: 'app-questionnaire',
  imports: [CommonModule, FormsModule],
  templateUrl: './questionnaire.component.html',
  styleUrl: './questionnaire.component.scss',
})
export class QuestionnaireComponent {
  constructor(
    private elementData: ELEMENTDATAService,
    private router: Router,
    private questService: QuestService,
    private dialog: MatDialog
  ) {}
  dataArray: any;
  questData: any;
  questArray: any[] = [];
  userName!: string;
  userPhone!: string;
  userEmail!: string;
  userAge!: number;
  newQuestArray: Array<any> = [];
  name!:string;
  startTime!:string;
  endTime!:string;
  description!:string;


  ngOnInit(): void {
    this.dataArray = this.elementData.questionData;
    this.questData = this.elementData.questionData[0];
    this.questArray = this.questData.questArray;

    this.name = this.questData.name;
    this.startTime = this.questData.startTime;
    this.endTime = this.questData.endTime;
    this.description = this.questData.description;

    if(!this.questService.questData){
      //如果service沒資料代表還沒填過，帶入題目
      this.tidyQuestArray()
    }
      //如果service有資料則把service的資料抓回來
      else{
        console.log(this.questService.questData);
        this.name=this.questService.questData.name;
        this.startTime=this.questService.questData.startTime;
        this.endTime=this.questService.questData.endTime;
        this.description=this.questService.questData.description;
        this.userName= this.questService.questData.userName;
        this.userPhone= this.questService.questData.userPhone;
        this.userEmail= this.questService.questData.userEmail;
        this.userAge= this.questService.questData.userAge;
        this.newQuestArray= this.questService.questData.questArray
    }
  }

  tidyQuestArray() {
    //在每個題目加入textAnswer、radioAnswer
    for (let array of this.questArray) {
      this.newQuestArray.push({ ...array, textAnswer: '', radioAnswer: '' });
    }
    console.log(this.newQuestArray);

    //在新增完textAnswer、radioAnswer後的每個選項加入布林值
    for (let newArray of this.newQuestArray) {
      let options = [];
      for (let option of newArray.options) {
        options.push({ ...option, checkboxAnswer: false });
      }
      newArray.options = options;
    }
  }

  checkNeeds(): boolean {
    if (!this.userName || !this.userPhone || !this.userEmail || !this.userAge) {
     this.dialog.open(DialogComponent, {
             data: { message: '請填寫基本資料', title: '提示', showCancel: false },
           });
      return false;
    }
    for (let quest of this.newQuestArray) {
      console.log(quest);

      //單選single,多選multiple,簡答text
      if (quest.required) {
        if (quest.type === 'multiple') {
          let check = false;

          for (let option of quest.options) {
            if (option.checkboxAnswer) {
              check = true;
            }
          }

          if (!check) {
            this.dialog.open(DialogComponent, {
              data: { message: '請填寫多選題', title: '提示', showCancel: false },
            });
            return false
          }
        }
        else if(quest.type == 'single'){
          if(!quest.radioAnswer){
            this.dialog.open(DialogComponent, {
              data: { message: '請填寫單選題', title: '提示', showCancel: false },
            });
            return false
          }
        }
        else if(quest.type == 'text'){
          if(!quest.textAnswer){
            this.dialog.open(DialogComponent, {
              data: { message: '請填寫簡答題', title: '提示', showCancel: false },
            });
            return false
          }
        }
      }
    }
    //通過以上驗證回傳]true表示已驗證
    return true
  }

   toPreview(){
    //判斷必填之後把資料打包(傳進service)
    if(this.checkNeeds()){
      this.questService.questData={
        name:this.questData.name,
        startTime:this.questData.startTime,
        endTime:this.questData.endTime,
        description:this.questData.description,
        userName: this.userName,
        userPhone: this.userPhone,
        userEmail: this.userEmail,
        userAge: this.userAge,
        questArray: this.newQuestArray
      }
    this.router.navigateByUrl('preview');
    }
   }

   toList(){
    this.router.navigateByUrl('');
   }

}
