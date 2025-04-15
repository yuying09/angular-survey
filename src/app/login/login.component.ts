import { AdminService } from './../@services/admin.service';
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  constructor(private formBuilder: FormBuilder,private cdr: ChangeDetectorRef,private router:Router,public admin:AdminService) {}
  private _snackBar = inject(MatSnackBar);
  errorDismissTimeout: any = null;
  //input共同控制
  loginForm!: FormGroup;
  submitted: boolean = false;
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$')
      ]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    this.loginForm.valueChanges.subscribe(values=>{
      if(!this.showError) return;
      const { email, password, confirmPassword } = values;
      const isAnyTyped = !!email || !!password || !!confirmPassword;

      if (this.errorDismissTimeout) {
        clearTimeout(this.errorDismissTimeout);
      }

      this.errorDismissTimeout = setTimeout(() => {
        this.showError = false;
        this.cdr.detectChanges();
        this.errorDismissTimeout = null; // 清掉 timeout 狀態
      }, 500);
    })
  }


  get formControls() {
    return this.loginForm.controls;
  }

  isFloating(field:string):boolean{
    return (this as any)[`${field}Focused`] || this.formControls[field].value
  }


  login() {
    this.submitted = true;

    const validEmail = 'test@email.com';
    const validPassWord = '123456';
    const email = this.formControls['email'].value;
    const password = this.formControls['password'].value;
    const confirmPassword = this.formControls['confirmPassword'].value

    //先判斷有沒有填寫帳號密碼
    if (!email || !password || !confirmPassword) {
      this.showErrorMessage('請確認欄位是否填寫完畢')
      return;
    }

    if (email === validEmail && password === validPassWord && password ===confirmPassword) {
      this.isLogin = true;
      this._snackBar.open('登入成功', '關閉',{duration:2000});
      this.admin.setAdminStatus(true);
      this.admin.savedEmail=email
      this.router.navigateByUrl('');
    } else {
      this.isLogin = false;
      this.showErrorMessage('請輸入正確的帳號密碼')
    }
  }


  shouldShowError(ctrl: AbstractControl | null): boolean {
    return !!ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty || this.submitted);
  }
  //email input控制

  emailFocused: boolean = false;


  onEmailBlur() {
    if (!this.formControls['email'].value) {
      this.emailFocused = false;
    }
  }

  //密碼 input控制
  password: string = '';
  passwordFocused: boolean = false;
  hidePassword: boolean = true;
  onPasswordBlur() {
    if (!this.formControls['password'].value) {
      this.passwordFocused = false;
    }
  }
  changeVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  //確認密碼
  confirmPassword: string = '';
  confirmPasswordFocused: boolean = false;
  onConfirmPasswordBlur() {
    if (!this.formControls['confirmPassword'].value) {
      this.confirmPasswordFocused = false;
    }
  }

  showConfirmPasswordError(): boolean {
    const pwd = this.formControls['password'];
    const confirm = this.formControls['confirmPassword'];
    const misMatch = pwd.value !== confirm.value
    const pwdTexted = pwd.dirty;
    const confirmInteracted = confirm.touched||confirm.dirty

    return(misMatch&&(pwdTexted||confirmInteracted|| this.submitted))
  }

  //判斷密碼強度
  get passwordStrength(): 'low' | 'middle' | 'strong' | '' {
    const passwordText = this.formControls['password'].value || '';
    let score = 0;

    if (passwordText.length >= 6) score++;
    if (passwordText.length >= 10) score++;
    if (/[A-Z]/.test(passwordText)) score++;
    if (/[0-9]/.test(passwordText)) score++;

    switch (score) {
      case 0:
      case 1:
        return 'low';

      case 2:
      case 3:
        return 'middle';

      case 4:
      case 5:
        return 'strong';

      default:
        return '';
    }
  }

  //把英文換成中文顯現
  strengthMap: Record<'low' | 'middle' | 'strong' | '', string> = {
    low: '弱',
    middle: '中',
    strong: '強',
    '': '',
  };

  //登入驗證(假帳密)
  loginError: string = '';
  isLogin :boolean=false
  showError: boolean = false;


  showErrorMessage(message: string) {
    this.showError = false;
    this.loginError = '';
    this.cdr.detectChanges(); // 先強迫清空

    setTimeout(() => {
      this.loginError = message;
      this.showError = true;
      this.cdr.detectChanges(); // 再強迫更新
    }, 50);
  }

  logOut(){
    this.admin.setAdminStatus(false);
    this._snackBar.open('登出成功', '關閉',{duration:2000});
    this.router.navigateByUrl('')
  }
}
