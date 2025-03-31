import {
  Directive,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core";
import { Subscription } from "rxjs";
import { AccountType } from "../enums/account-type-enum";
import { UserService } from "../services/user/user.service";

@Directive({
  selector: "[appHasRole]",
})
export class HasRoleDirective implements OnDestroy {
  private subscription: Subscription;
  private currentUserRole: AccountType | null = null;
  private allowedRoles: AccountType[] = [];
  private hasView = false; // flag to track if the view is already created

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userService: UserService,
  ) {
    // Subscribe to the currentUser observable to get role updates
    this.subscription = this.userService.currentUser$.subscribe((user) => {
      this.currentUserRole = user ? user.role : null;
      this.updateView();
    });
  }

  // Input property to set the allowed roles
  @Input()
  set appHasRole(roles: AccountType[]) {
    this.allowedRoles = roles;
    this.updateView();
  }

  private updateView() {
    if (
      this.currentUserRole && this.allowedRoles.includes(this.currentUserRole)
    ) {
      // Only create the view if it hasn't been created already
      if (!this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      }
    } else {
      // Clear the view if it exists
      if (this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
