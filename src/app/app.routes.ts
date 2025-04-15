import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { PreviewComponent } from './preview/preview.component';
import { ChartsComponent } from './charts/charts.component';
import { LoginComponent } from './login/login.component';
import { AddQuestionnaireComponent } from './add-questionnaire/add-questionnaire.component';

export const routes: Routes = [
  {path:"",component:ListComponent},
  {path:"questionnaire",component:QuestionnaireComponent},
  {path:"preview",component:PreviewComponent},
  {path:"chart",component:ChartsComponent},
  {path:"login",component:LoginComponent},
  {path:"add-questionnaire",component:AddQuestionnaireComponent}
];
