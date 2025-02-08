import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BEResponse,
  Question,
  QuestionAnswers,
} from '../../models/shared-models';

@Injectable({
  providedIn: 'root',
})
export class QuestionsApiService {
  private http = inject(HttpClient);
  constructor() {}

  get(): Observable<BEResponse<Question[]>> {
    return this.http.get<BEResponse<Question[]>>(`api/questions`);
  }
  getAccountAnswers(
    accountId: number
  ): Observable<BEResponse<QuestionAnswers[]>> {
    return this.http.get<BEResponse<QuestionAnswers[]>>(
      `api/accounts/${accountId}/questions-answers`
    );
  }
  updateAccountAnswers(
    accountId: number,
    questionAnswers: QuestionAnswers[]
  ): Observable<BEResponse<QuestionAnswers[]>> {
    return this.http.put<BEResponse<QuestionAnswers[]>>(
      `api/accounts/${accountId}/questions-answers`,
      questionAnswers
    );
  }
}
