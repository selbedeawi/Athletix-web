import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MemberFormComponent } from '../member-form/member-form.component';
import { TranslationTemplates } from '../../../../shared/enums/translation-templates-enum';
import { MemberService } from '../../services/member.service';
import { MemberAccount } from '../../models/member';
import { SnackbarService } from '../../../../core/services/snackbar/snackbar.service';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { APP_ROUTES } from '../../../../core/enums/pages-urls-enum';
import { ConfirmDeleteComponent } from '../../../../shared/ui-components/templates/confirm-delete/confirm-delete.component';
import { ChangePasswordDialogComponent } from '../../../../shared/ui-components/templates/change-password-dialog/change-password-dialog.component';
import { UpdateEmailDialogComponent } from '../../../../shared/ui-components/templates/change-email-dialog/change-email-dialog';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../../../../core/services/user/user.service';

@Component({
  selector: 'app-member-profile',
  imports: [
    MemberFormComponent,
    FormsModule,
    TranslocoDirective,
    MatMenuModule,
    MatIcon,
    MatButtonModule,
    HasRoleDirective,
  ],
  templateUrl: './member-profile.component.html',
  styleUrl: './member-profile.component.scss',
})
export class MemberProfileComponent implements OnInit {
  translationTemplate = TranslationTemplates.MEMBER;
  private dialog = inject(MatDialog);
  private router = inject(Router);
  id = input.required<string>();
  member = signal(new MemberAccount());
  cloneMember = new MemberAccount();

  private memberService = inject(MemberService);
  private snackbarService = inject(SnackbarService);
  private userService = inject(UserService);
  isCoach = signal(false);
  // nationalIdRegExp = /^(2|3)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{7}$/;

  ngOnInit(): void {
    this.userService.currentUser$
      .pipe(takeUntilDestroyed())
      .subscribe((user) => {
        const role = user?.role?.toLowerCase() ?? '';
        this.isCoach.set(role === 'coach');
      });
    this.memberService.getMember(this.id()).subscribe((res) => {
      this.member.set(res);
      this.cloneMember = structuredClone(res);
    });
  }
  update() {
    if (this.isCoach()) {
      return;
    }
    this.memberService.updateMember(this.id(), this.member()).subscribe(() => {
      this.snackbarService.success(`UPDATE_MEMBER_SUCCESS`);
    });
  }
  // setBirthDate(account: MemberAccount, nationalId: any) {
  //   if (nationalId.length !== 14 || !this.nationalIdRegExp.test(nationalId)) {
  //     account.dateOfBirth = null as any;
  //     return;
  //   }
  //   const yearMI = nationalId.slice(0, 1);
  //   const year = nationalId.slice(1, 3);
  //   const month = nationalId.slice(3, 5);
  //   const day = nationalId.slice(5, 7);
  //   account.dateOfBirth = `${
  //     yearMI === "2" ? "19" : "20"
  //   }${year}-${month}-${day}`;
  // }

  toggleActivate(e: boolean) {
    this.cloneMember.isActive = e;
    this.memberService
      .updateMember(this.cloneMember.id, this.cloneMember)
      .subscribe((res) => {
        if (!res.error) {
          this.snackbarService.success('EDIT_MEMBER_SUCCESS');
          this.router.navigate(['/', APP_ROUTES.MEMBERS_LIST]);
        }
      });
  }
  deleteStaff() {
    this.dialog
      .open(ConfirmDeleteComponent, {
        data: {
          translationTemplate: this.translationTemplate,
          headerText: 'DELETE_MEMBER_HEADER',
          content: 'DELETE_MEMBER_CONTENT',
          cancelText: 'NO',
          okText: 'YES',
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.cloneMember.isDeleted = true;
          this.memberService
            .deleteMember(this.cloneMember.id)
            .subscribe((res) => {
              if (!res.error) {
                this.snackbarService.success('DELETE_STAFF_SUCCESS');
                this.router.navigate(['/', APP_ROUTES.MEMBERS_LIST]);
              }
            });
        }
      });
  }
  openChangeEmailDialog() {
    const ref = this.dialog.open(UpdateEmailDialogComponent, {
      data: {
        userId: this.member().id,
        email: this.member().email,
      },
      width: '400px',
      minWidth: '300px',
    });

    ref.afterClosed().subscribe((result) => {
      if (result?.success) {
        // Update your local signal so the template shows the new email
        this.member.update((acc) => ({ ...acc, email: result.email }));
        this.snackbarService.success('CHANGE_EMAIL_SUCCESS');
      }
    });
  }
  openChangePasswordDialog() {
    const ref = this.dialog.open(ChangePasswordDialogComponent, {
      data: {
        userId: this.member().id,
      },
      width: '400px',
      minWidth: '300px',
    });
    ref.afterClosed().subscribe((result) => {
      if (result?.success) {
        this.snackbarService.success('CHANGE_PASSWORD_SUCCESS');
      }
    });
  }
}
