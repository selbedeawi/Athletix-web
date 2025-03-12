import { Route } from "@angular/router";
import { APP_ROUTES } from "../../core/enums/pages-urls-enum";
import { authGuard } from "../../core/guards/auth/auth.guard";

export default [
  {
    path: "",
    loadComponent: () =>
      import(
        "./members-list.component"
      ).then((c) => c.MembersListComponent),
    // canActivate: [authGuard],
  },
  {
    path: APP_ROUTES.MEMBERS_ADD,
    loadComponent: () =>
      import(
        "./components/add-member/add-member.component"
      ).then((c) => c.AddMemberComponent),
    // canActivate: [authGuard],
  },
  {
    path: `${APP_ROUTES.MEMBERSHIP_EDIT}/:id`,
    loadComponent: () =>
      import(
        "./components/edit-member/edit-member.component"
      ).then((c) => c.EditMemberComponent),
    children: [
      {
        path: "",
        redirectTo: APP_ROUTES.MEMBER_PROFILE,
        pathMatch: "full",
      },
      {
        path: APP_ROUTES.MEMBER_PROFILE,
        loadComponent: () =>
          import(
            "./components/member-profile/member-profile.component"
          ).then((c) => c.MemberProfileComponent),
        data: {
          route: APP_ROUTES.MEMBER_PROFILE,
          label: "MEMBER_PROFILE",
        },
      },
      {
        path: APP_ROUTES.MEMBER_MEMBERSHIPS,
        loadComponent: () =>
          import(
            "./components/member-active-membership/member-active-membership.component"
          ).then((c) => c.MemberActiveMembershipComponent),
        data: {
          route: APP_ROUTES.MEMBER_MEMBERSHIPS,
          label: "MEMBER_MEMBERSHIPS",
        },
      },
      {
        path: APP_ROUTES.MEMBER_HISTORY,
        loadComponent: () =>
          import(
            "./components/member-membership-history/member-membership-history.component"
          ).then((c) => c.MemberMembershipHistoryComponent),
        data: {
          route: APP_ROUTES.MEMBER_HISTORY,
          label: "MEMBER_HISTORY",
        },
      },
    ],
  },
] satisfies Route[];
