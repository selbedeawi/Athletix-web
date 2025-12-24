import { Component, computed, inject } from '@angular/core';
import { UserMembershipService } from './services/user-membership.service';
import { SnackbarService } from '../../core/services/snackbar/snackbar.service';
import { BranchesService } from '../../core/services/branches/branches.service';
import { MemberFilterComponent } from './components/member-filter/member-filter.component';
import { EmptyResultComponent } from '../../shared/ui-components/templates/empty-result/empty-result.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { TranslationTemplates } from '../../shared/enums/translation-templates-enum';
import { APP_ROUTES } from '../../core/enums/pages-urls-enum';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { HasRoleDirective } from '../../core/directives/has-role.directive';

@Component({
  selector: 'app-members-list',
  imports: [
    MemberFilterComponent,
    MatDivider,
    MatCard,
    MatCardContent,
    TranslocoDirective,
    MatButtonModule,
    MatPaginator,
    EmptyResultComponent,
    RouterLink,
    MatIcon,
    NgxMaskPipe,
    HasRoleDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './members-list.component.html',
  styleUrl: './members-list.component.scss',
})
export class MembersListComponent {
  translationTemplate = TranslationTemplates.MEMBER;
  APP_ROUTES = APP_ROUTES;

  private userMembershipService = inject(UserMembershipService);
  private snackbarService = inject(SnackbarService);
  private branchesService = inject(BranchesService);

  allowSync = computed(() => !!this.branchesService.value().allowScan);

  batchSyncToGate() {
    const branchId = this.branchesService.value().id;
    if (!branchId) {
      return;
    }
    this.userMembershipService.batchSyncToGate(branchId).subscribe({
      next: () => this.snackbarService.success('BATCH_SYNC_SUCCESS'),
      error: () => this.snackbarService.error('BATCH_SYNC_ERROR'),
    });
  }
}
