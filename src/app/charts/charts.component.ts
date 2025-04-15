import { Component,signal } from '@angular/core';
import Chart from 'chart.js/auto';
import { ELEMENTDATAService } from '../@services/element-data.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
@Component({
  selector: 'app-charts',
  imports: [RouterLink,RouterLinkActive,MatExpansionModule,MatIconModule,MatTooltipModule],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss',
})

export class ChartsComponent {
  constructor(private elementData: ELEMENTDATAService,private router:Router) {}
  dataArray: any;
  questData: any;
  questArray: any[] = [];
  options:any[]=[]
  chartData: any[] = [
    {
      questionId: '1',
      type: 'single',
      question: '你覺得遇見靈魂伴侶最可能的情境是？',
      labels: [
        '在朋友介紹下認識',
        '在旅途中不期而遇',
        '透過社群或交友軟體',
        '職場或學習中逐漸了解',
        '某次特別的活動中邂逅',
      ],
      data: [100, 200, 300, 400, 500],
      color: [
        'rgb(205,180,219)',
        'rgb(242,181,212)',
        'rgb(247,214,224)',
        'rgb(189, 224, 254)',
        'rgb(178,247,239)',
      ],
    },
    {
      questionId: '2',
      type: 'multiple',
      question: '你認為靈魂伴侶應該具備哪些特質？（可複選）',
      labels: [
        '懂得傾聽',
        '價值觀相近',
        '對未來有共同想像',
        '幽默感',
        '讓你感到自在與安心',
      ],
      data: [100, 200, 300, 400, 500],
      color: [
        'rgb(205,180,219)',
        'rgb(242,181,212)',
        'rgb(247,214,224)',
        'rgb(189, 224, 254)',
        'rgb(178,247,239)',
      ],
    },
    {
      questionId: '3',
      type: 'text',
      question: '你曾經有過像是遇到靈魂伴侶的感覺嗎？請簡述那次的經驗或感受。',
      labels: ['心有靈犀',
        '未曾有過',
        '如果~全世界我也可以放棄',
        '如果我說愛我沒有如果',],
      data: [
        100, 200, 300, 400
      ],
      color: [
        'rgb(205,180,219)',
        'rgb(242,181,212)',
        'rgb(247,214,224)',
        'rgb(189, 224, 254)',
        'rgb(178,247,239)',
      ],
    },
  ];
  optionData!: any;
  textData!: any;
  newArray :any[]=[];

  readonly panelOpenState = signal(false)

  //找到最高票
  getMostVotedData(question: { labels: string[], data: number[] }){
    //找出票數最大值
    const maxVote = Math.max(...question.data)

    //找出最大票數位置
    const maxVoteIndex = question.data.indexOf(maxVote)

    //根據 index 找到對應的選項文字
    const maxVoteLabel = question.labels[maxVoteIndex]

    //將三個值回傳
    return{
      maxVote,
      maxVoteIndex,
      maxVoteLabel
    }
  }

  //自製legend
  getLegendData(question :{ labels: string[], data: number[],color:string[]}){
    const total =  question.data.reduce((a, b) => a + b, 0);
    return question.labels.map((label,index)=>{
      const value = question.data[index];
      const percent = ((value / total) * 100).toFixed(1);

      return{
        label,
        value,
        percent,
        color: question.color[index]
      }
    })

  }

  toList(){
    this.router.navigateByUrl("")
  }

  //控制說明欄收合
  introOpen =true;
  handlePanelOpen (){
    this.introOpen =false;
  }

  ngOnInit(): void {
    this.dataArray = this.elementData.questionData;
    this.questData = this.elementData.questionData[0];
    this.questArray = this.questData.questArray;
    for (let i = 0; i < this.questArray.length; i++) {
      let jsonData = {
        questionId: this.questArray[i].questionId,
        question:this.questArray[i].question,
        type:this.questArray[i].type,
        data:this.chartData[i].data,
        labels: this.chartData[i].labels,
        color:this.chartData[i].color,
      }
      this.newArray.push(jsonData);
      console.log(this.questData);
    }
  }

  ngAfterViewInit(): void {
    for (let quest of this.newArray) {
      console.log(quest);
      let ctx = document.getElementById(
        quest.questionId
      ) as HTMLCanvasElement;

      // 設定數據
      let data ={
        // x 軸文字
        labels: quest.labels,
        datasets: [
          {
            // 上方分類文字
            label: quest.question,
            // 數據
            data: quest.data,
            // 線與邊框顏色
            backgroundColor: quest.color,
            //設定hover時的偏移量，滑鼠移上去表會偏移，方便觀看選種的項目
            hoverOffset: 4,
          },
        ],
      };

      // 創建圖表


          if (quest.type == 'single' || quest.type == 'multiple') {
            let chart = new Chart(ctx, {
              //pie是圓餅圖,doughnut是環狀圖
              type: 'pie',
              data:data,
              options: {
                layout: {
                  padding: 20,
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const value = Number(context.raw);
                        const dataArray = context.chart.data.datasets[0].data as number[];
                        const total = dataArray.reduce((a, b) => a + b, 0);
                        const percent = ((value / total) * 100).toFixed(1);
                        return `${context.label}:${value}票 ${percent}%`;
                      }
                    }
                  },legend: {
                    display: false  // 👈 就這行，隱藏內建 legend
                  }}
              },
            });
          }
          if (quest.type == 'text') {
            let chart = new Chart(ctx, {
              //bar是圓餅圖
              type: 'bar',
              data:data,
              options: {
                layout: {
                  padding: 0,
                },plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const value = Number(context.raw);
                        const dataArray = context.chart.data.datasets[0].data as number[];
                        const total = dataArray.reduce((a, b) => a + b, 0);
                        const percent = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${value}票 ${percent}%`;
                      }
                    }
                  },legend: {
                    display: false  // 👈 就這行，隱藏內建 legend
                  }},
              },
            });
          }
      }
    }
  }

