// import { HttpClient } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { AssociateAccount } from '../../models/associate-account-model';
// import { PrimaryAccount } from '../../models/primary-account-model';
// import { BEResponse } from '../../models/shared-models';
// import { FamilyMemberAccount } from '../../models/family-member-account-model';

// @Injectable({
//   providedIn: 'root',
// })
// export class AccountsService {
//   private http = inject(HttpClient);
//   constructor() {}

//   createFamily(
//     account: PrimaryAccount
//   ): Observable<BEResponse<PrimaryAccount>> {
//     return this.http.post<BEResponse<PrimaryAccount>>(
//       `api/accounts/create-family`,
//       account
//     );
//   }
//   createAssociate(
//     account: AssociateAccount
//   ): Observable<BEResponse<AssociateAccount>> {
//     return this.http.post<BEResponse<AssociateAccount>>(
//       `api/accounts/create-associate`,
//       account
//     );
//   }
//   getFamilyMembers(
//     familyId: number
//   ): Observable<BEResponse<FamilyMemberAccount[]>> {
//     return this.http.get<BEResponse<FamilyMemberAccount[]>>(
//       `api/accounts/${familyId}/family-members`
//     );
//   }
//   addFamilyMembers(
//     familyId: number,
//     account: FamilyMemberAccount
//   ): Observable<BEResponse<FamilyMemberAccount>> {
//     return this.http.post<BEResponse<FamilyMemberAccount>>(
//       `api/accounts/${familyId}/add-family-member`,
//       account
//     );
//   }
//   getAccountById(
//     id: number
//   ): Observable<
//     BEResponse<FamilyMemberAccount | PrimaryAccount | AssociateAccount>
//   > {
//     return this.http.get<
//       BEResponse<FamilyMemberAccount | PrimaryAccount | AssociateAccount>
//     >(`api/accounts/${id}`);
//   }
//   updateAccount(
//     account: FamilyMemberAccount | PrimaryAccount | AssociateAccount
//   ): Observable<
//     BEResponse<FamilyMemberAccount | PrimaryAccount | AssociateAccount>
//   > {
//     return this.http.put<
//       BEResponse<FamilyMemberAccount | PrimaryAccount | AssociateAccount>
//     >(`api/accounts/${account.id}`, account);
//   }
// }
