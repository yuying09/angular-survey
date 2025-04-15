import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ELEMENTDATAService {
  questionData = [
    {
      position: 1,
      tag: '有趣',
      name: '你會怎麼遇見靈魂伴侶？',
      startTime: '2025-3-20',
      endTime: '2025-3-25',
      action: '查看',
      description:
        '每個人心中對靈魂伴侶都有一份浪漫的想像，有人相信命中注定，有人相信努力創造。這份問卷將透過你的直覺和生活習慣，探索你可能遇見靈魂伴侶的情境與方式。不論是擦肩而過的偶遇、朋友的介紹，還是工作中的默契搭檔，或許你的答案，就藏在這幾個選項之中。準備好打開心的雷達了嗎？讓我們一起來找找你的那個人會在哪裡出現吧',
      questArray: [
        {
          questionId: 1,
          required: true,
          question: '你覺得遇見靈魂伴侶最可能的情境是？',
          type: 'single',
          options: [
            { label: '在朋友介紹下認識', value: 'A' },
            { label: '在旅途中不期而遇', value: 'B' },
            { label: '透過社群或交友軟體', value: 'C' },
            { label: '職場或學習中逐漸了解', value: 'D' },
            { label: '某次特別的活動中邂逅', value: 'E' },
          ],
        },
        {
          questionId: 2,
          required: true,
          question: '你認為靈魂伴侶應該具備哪些特質？（可複選）',
          type: 'multiple',
          options: [
            { label: '懂得傾聽', value: 'A' },
            { label: '價值觀相近', value: 'B' },
            { label: '對未來有共同想像', value: 'C' },
            { label: '幽默感', value: 'D' },
            { label: '讓你感到自在與安心', value: 'E' },
          ],
        },
        {
          questionId: 3,
          required: true,
          question: '你曾經有過像是遇到靈魂伴侶的感覺嗎？請簡述那次的經驗或感受。',
          type: 'text',
          options:[],
          placeholder: "寫下你的故事或感受",
        },
      ],
    },
  ];

  addQuestionData (survey:any){
    this.questionData.push(survey)
  }
  constructor() {}
}

export interface PeriodicElement {
  name: string;
  id: number;
  tag: string;
  action: string;
  startTime: string;
  endTime: string;
  status:string;
  statusCode:string
}
