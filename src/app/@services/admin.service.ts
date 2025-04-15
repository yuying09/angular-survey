import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();
  constructor() { }



   // 登入時呼叫
   setAdminStatus(status: boolean) {
    this.isAdminSubject.next(status);
  }

  // 可選：取得目前狀態
  get isAdmin(): boolean {
    return this.isAdminSubject.value;
  }

  savedEmail!:string
}
