import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router,  RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {  PeriodicElement } from '../@services/element-data.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import { AdminService } from '../@services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
@Component({
  selector: 'app-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    MatIconModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatTooltipModule

  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements AfterViewInit {
  constructor (private router:Router, public admin:AdminService ,private dialog: MatDialog){}
  displayedColumns: any[] = [
    'tag',
    'name',
    'status',
    'startTime',
    'endTime',
    'action',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  startDate!: any;
  endDate!: any;
  searchText!: string;
  isAdmin:boolean=false

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  focusSearchBox() {
    document.getElementById('searchInput')?.focus();
  }

  searchChange(event: Event) {
    let searchResult = [];
    for (let data of ELEMENT_DATA) {
      if (data.name.indexOf(this.searchText) != -1) {
        searchResult.push(data);
      }
    }
    this.dataSource.data = searchResult;
  }

  chooseDate() {
    if (!this.startDate) {
      this.endDate=null
    this.dataSource.data =ELEMENT_DATA;
    return
    }

    let chooseDateResult =ELEMENT_DATA.filter((data)=>{

      const selectedStartDate =this.startDate? new Date(this.startDate):null;
      const selectedEndDate =this.endDate ? new Date(this.endDate):null;
      const dataStartDate = new Date(data.startTime)
      const dataEndDate = new Date(data.endTime)

      if(selectedStartDate && selectedEndDate){
        return  dataStartDate>=selectedStartDate && dataEndDate<=selectedEndDate
      }else if (selectedStartDate){
        return dataStartDate>=selectedStartDate
      }else {
        return true
      }
    })
    this.dataSource.data=chooseDateResult
  }


  toQuestionnaire(element:any){
    //statusCode F:已結束 P:進行中 U:未開始
    if(element.statusCode == "P"){
      this.router.navigateByUrl("questionnaire")
    }
  }

  toChart(element:any){
      if(element.statusCode == "F"){
        this.router.navigateByUrl("chart")
    }
  }

  deleteQuestionnaire(id:number){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        message: '是否要刪除此筆問卷？',
        title:'提示'
      },
      disableClose:true
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(
          item => item.id !== id
        );
      }})
  }


  ngOnInit(): void {
      this.admin.isAdmin$.subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
        this.setDisplayedColumns()
      });
  }

  setDisplayedColumns(){
    let adminDisplayedColumns:any=[];
      if(!this.isAdmin){
        this.displayedColumns= this.displayedColumns
      }else if(this.isAdmin){
        adminDisplayedColumns=[...this.displayedColumns,'deleteBtn'];
        this.displayedColumns= adminDisplayedColumns
      }
  }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

  }
}


const ELEMENT_DATA: PeriodicElement[] = [
  {
    id: 1,
    tag: '有趣',
    name: '你會怎麼遇見靈魂伴侶？',
    startTime: '2025-3-18',
    endTime: '2025-3-23',
    action: '查看',
    status:"已結束",
    statusCode:"F"
  },
  {
    id: 2,
    tag: '時事',
    name: '這些流行語你跟上了嗎？',
    startTime: '2025-3-18',
    endTime: '2025-3-23',
    action: '查看',
    status:"已結束",
    statusCode:"F"
  },
  {
    id: 3,
    tag: '懷舊',
    name: '這些經典卡通主題曲，你會唱幾首？',
    startTime: '2025-3-18',
    endTime: '2025-3-23',
    action: '查看',
    status:"已結束",
    statusCode:"F"
  },
  {
    id: 4,
    tag: '有趣',
    name: '你的內心年齡幾歲？',
    startTime: '2025-3-20',
    endTime: '2025-3-25',
    action: '查看',
    status:"已結束",
    statusCode:"F"
  },
  {
    id: 5,
    tag: '懷舊',
    name: '你是哪種 90 年代偶像劇角色？',
    startTime: '2025-3-20',
    endTime: '2025-3-25',
    action: '查看',
    status:"已結束",
    statusCode:"F"
  },
  {
    id: 6,
    tag: '時事',
    name: '你的投資直覺適合炒股還是買樂透？',
    startTime: '2025-3-20',
    endTime: '2025-3-25',
    action: '查看',
    status:"已結束",
    statusCode:"F"
  },
  {
    id: 7,
    tag: '懷舊',
    name: '這些經典網路用語，你還會用嗎？',
    startTime: '2025-3-25',
    endTime: '2025-3-30',
    action: '查看',
    status:"進行中",
    statusCode:"P"
  },
  {
    id: 8,
    tag: '有趣',
    name: '你的腦袋適合當偵探還是詐騙高手？',
    startTime: '2025-3-25',
    endTime: '2025-3-30',
    action: '查看',
    status:"進行中",
    statusCode:"P"
  },
  {
    id: 5,
    tag: '流行',
    name: '你追過的韓劇 / 動漫，透露了你哪種戀愛性格？',
    startTime: '2025-3-25',
    endTime: '2025-3-30',
    action: '查看',
    status:"進行中",
    statusCode:"P"
  },
  {
    id: 10,
    tag: '流行',
    name: '你的 MBTI 個性其實是社交天才還是孤僻大師？',
    startTime: '2025-3-25',
    endTime: '2025-3-30',
    action: '查看',
    status:"進行中",
    statusCode:"P"
  },
  {
    id: 11,
    tag: '時事',
    name: '這些世界正在發生的事，哪件最能改變你的人生？',
    startTime: '2025-3-25',
    endTime: '2025-3-30',
    action: '查看',
    status:"進行中",
    statusCode:"P"
  },
  {
    id: 12,
    tag: '流行',
    name: '你適合哪一種副業？（測測你的斜槓指數）',
    startTime: '2025-3-29',
    endTime: '2025-4-5',
    action: '查看',
    status:"未開始",
    statusCode:"U"
  },
  {
    id: 13,
    tag: '有趣',
    name: '你是哪種怪咖排行榜的第一名？',
    startTime: '2025-3-29',
    endTime: '2025-4-5',
    action: '查看',
    status:"未開始",
    statusCode:"U"
  },
  {
    id: 14,
    tag: '時事',
    name: '你能分辨這是最新科技還是科幻電影嗎？',
    startTime: '2025-3-29',
    endTime: '2025-4-5',
    action: '查看',
    status:"未開始",
    statusCode:"U"
  },
  {
    id: 15,
    tag: '懷舊',
    name: '你的 MSN 狀態語錄會是什麼？',
    startTime: '2025-3-29',
    endTime: '2025-4-5',
    action: '查看',
    status:"未開始",
    statusCode:"U"
  },
  {
    id: 16,
    tag: '流行',
    name: '你的穿搭風格，適合哪個時代的潮流？',
    startTime: '2025-3-29',
    endTime: '2025-4-5',
    action: '查看',
    status:"未開始",
    statusCode:"U"
  },
  {
    id: 17,
    tag: '有趣',
    name: '你的日常行為藏著哪種「社交動物」特質？',
    startTime: '2025-3-29',
    endTime: '2025-4-5',
    action: '查看',
    status:"未開始",
    statusCode:"U"
  },
  {
    id: 18,
    tag: '流行',
    name: '這些 2025 最夯的時尚趨勢，你敢不敢嘗試？',
    startTime: '2025-3-31',
    endTime: '2025-4-10',
    action: '查看',
    status:"未開始",
    statusCode:"U"
  },
  {
    id: 19,
    tag: '有趣',
    name: '你的EMO指數有多高?',
    startTime: '2025-3-31',
    endTime: '2025-4-10',
    action: '查看',
    status:"未開始",
    statusCode:"U"
  },
  {
    id: 20,
    tag: '懷舊',
    name: '這些經典廣告台詞，你還記得幾句？',
    startTime: '2025-3-31',
    endTime: '2025-4-10',
    action: '查看',
    status:"未開始",
    statusCode:"U"
  },
];
