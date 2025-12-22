import { Component, inject, input, output, signal } from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  BehaviorSubject,
  debounceTime,
  filter,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { BranchesService } from '../../../../core/services/branches/branches.service';
import { MemberAccount } from '../../../../features/members-list/models/member';
import { MemberService } from '../../../../features/members-list/services/member.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-select-member',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  templateUrl: './select-member.component.html',
  styleUrl: './select-member.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class SelectMemberComponent {
  memberService = inject(MemberService);
  branchesService = inject(BranchesService);
  selectedMember: MemberAccount | undefined;
  label = input.required();
  types = input.required<('Individual' | 'PrivateCoach' | 'SessionBased')[]>();
  coachId = input<string | undefined>();
  branchId!: string;
  showPT = input(false);
  private destroyed$ = new Subject<void>();

  selectedMemberChange = output<MemberAccount>();

  // We'll use this BehaviorSubject to trigger the member search.
  searchTerm$ = new BehaviorSubject<string>('');
  // Expose the member options as an observable.
  memberOptions$: Observable<MemberAccount[]> = this.searchTerm$.pipe(
    debounceTime(250),
    // Ensure branch is already loaded.
    filter(() => !!this.branchId),
    switchMap((searchQuery) =>
      this.memberService.getAllMembers({
        searchQuery,
        branchId: this.branchId,
        isActive: true,
        types: this.types(),
        coachId: this.coachId(),
      })
    ),
    // Map the response to an array of MemberAccount.
    map((res) => {
      const finalMembers: MemberAccount[] = [];
      if (res.data) {
        res.data.forEach((member) => {
          // Check if the member has an array of UserMembership records
          if (
            Array.isArray(member.UserMembership) &&
            member.UserMembership.length > 0
          ) {
            member.UserMembership.forEach((userMembership) => {
              // Create a new object that matches the final MemberAccount shape,
              // copying member properties and assigning the current userMembership.
              const newMember = {
                ...member,
                UserMembership: userMembership as any,
              };
              finalMembers.push(newMember as any);
            });
          }
        });
      }

      return finalMembers ? finalMembers : [];
    })
  );

  constructor() {
    this.branchesService.currentBranch$
      .pipe(
        filter((branch) => !!branch),
        takeUntil(this.destroyed$)
      )
      .subscribe((branch) => {
        this.branchId = branch.id;
        // Trigger an initial empty search.
        this.searchTerm$.next('');
      });
  }

  displayFn(user: MemberAccount): string {
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
