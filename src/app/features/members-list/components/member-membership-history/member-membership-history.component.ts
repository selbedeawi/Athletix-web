import { Component, inject, input, OnInit, signal } from "@angular/core";
import { finalize } from "rxjs";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { UserMembership } from "../../models/member";
import { UserMembershipService } from "../../services/user-membership.service";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginator } from "@angular/material/paginator";
import { TranslocoDirective } from "@jsverse/transloco";
import { EmptyResultComponent } from "../../../../shared/ui-components/templates/empty-result/empty-result.component";

@Component({
  selector: "app-member-membership-history",
  imports: [
    TranslocoDirective,
    MatButtonModule,
    MatPaginator,
    EmptyResultComponent,
  ],
  templateUrl: "./member-membership-history.component.html",
  styleUrl: "./member-membership-history.component.scss",
})
export class MemberMembershipHistoryComponent implements OnInit {
  translationTemplate: TranslationTemplates = TranslationTemplates.MEMBER;
  userMembershipService = inject(UserMembershipService);
  id = input.required<string>();

  loading = signal(false);
  userMemberships = signal<UserMembership[]>([]);
  pageSize = signal(10);
  pageNumber = signal(1);
  originalCount = signal(0);
  constructor() {
  }
  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.loading.set(true);
    this.userMembershipService.getMembershipByUserId(
      this.id(),
      false,
      undefined,
      undefined,
    )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => {
        if (res.data) {
          this.userMemberships.set(res.data as UserMembership[]);

          this.originalCount.set((res as any).count || res.data?.length);
        }
      });
  }
}
