import { MemberService } from "./../../services/member.service";
import { Component, inject, signal } from "@angular/core";
import { InputComponent } from "../../../../shared/ui-components/atoms/input/input.component";
import { SelectComponent } from "../../../../shared/ui-components/atoms/select/select.component";
import { filter, finalize, Subject, takeUntil } from "rxjs";
import { TranslationTemplates } from "../../../../shared/enums/translation-templates-enum";
import { BridgesInputType } from "../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { TranslocoDirective } from "@jsverse/transloco";
import { SelectMembershipComponent } from "../../../../shared/ui-components/molecules/select-membership/select-membership.component";
import { DatePickerComponent } from "../../../../shared/ui-components/atoms/date-picker/date-picker.component";
import { AllMembersFilter, MemberAccount } from "../../models/member";
import { SelectStaffComponent } from "../../../../shared/ui-components/molecules/select-staff/select-staff.component";
import { BranchesService } from "../../../../core/services/branches/branches.service";
import { HasRoleDirective } from "../../../../core/directives/has-role.directive";
import { UserService } from "../../../../core/services/user/user.service";

@Component({
  selector: "app-member-filter",
  imports: [
    InputComponent,
    SelectComponent,
    FormsModule,
    TranslocoDirective,
    MatButtonModule,
    SelectMembershipComponent,
    DatePickerComponent,
    SelectStaffComponent,
    HasRoleDirective,
  ],
  templateUrl: "./member-filter.component.html",
  styleUrl: "./member-filter.component.scss",
})
export class MemberFilterComponent {
  translationTemplate: TranslationTemplates = TranslationTemplates.MEMBERSHIP;
  memberService = inject(MemberService);
  branchesService = inject(BranchesService);
  filters: AllMembersFilter = {
    membershipId: "",
    isActive: true,
    isCanceled: false,
  };

  bridgesInputType = BridgesInputType;

  userService = inject(UserService);
  loading = signal(false);
  members = signal<MemberAccount[]>([]);
  pageSize = signal(10);
  pageNumber = signal(1);
  originalCount = signal(0);
  private destroyed$ = new Subject<void>();
  constructor() {
    this.branchesService.currentBranch$
      .pipe(
        filter((branch) => !!branch),
        takeUntil(this.destroyed$),
      )
      .subscribe((branch) => {
        this.filters.branchId = branch.id;
        if (this.userService.currentUser?.role === "Sales") {
          this.filters.salesId = this.userService.currentUser.id;
        }
        this.getAll();
      });
  }

  getAll(isExport = false) {
    this.loading.set(true);

    this.memberService.getAllMembers(
      this.filters,
      isExport ? 1 : this.pageNumber(),
      isExport ? 10000 : this.pageSize(),
    )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => {
        if (res.data) {
          if (isExport) {
            this.downloadCSV(res.data);
          } else {
            this.members.set(res.data);
          }
          this.originalCount.set((res as any).count || res.data?.length);
        }
      });
  }

  reset() {
    this.filters = {
      membershipId: "",
    };
    if (this.userService.currentUser?.role === "Sales") {
      this.filters.salesId = this.userService.currentUser.id;
    }
    this.search();
  }

  search() {
    this.pageNumber.set(1);
    this.getAll();
  }
  /**
   * Exports an array of MemberAccount records to a CSV string.
   *
   * Expected columns:
   * ID, Branch, Name, Mobile, Membership, Membership Type, Start Date, End Date, Created At, Sales, Price
   * Plus, a final row showing the total sum of all Price values.
   *
   * @param data - The array of MemberAccount records.
   * @returns The CSV string.
   */
  exportToCSV(data: MemberAccount[]): string {
    if (!data || !data.length) return "";

    // Define CSV headers.
    const headers = [
      "ID",
      "Branch",
      "Name",
      "Mobile",
      "Membership",
      "Membership Type",
      "Start Date",
      "End Date",
      "Created At",
      "Sales",
      "Price",
    ];

    // Helper function to escape CSV fields.
    const escapeCSV = (value: any): string => {
      if (value == null) return "";
      let str = value.toString();
      // Enclose fields in double quotes if they contain commas, quotes, or newlines.
      if (/[",\n]/.test(str)) {
        str = `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Helper function to format a date string as yyyy/mm/dd.
    const formatDate = (dateStr: string): string => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}/${month}/${day}`;
    };

    // Create CSV rows.
    const csvRows = data.map((item) => {
      const mShip = item.UserMembership;
      // ID from MemberAccount (using memberId property)
      const id = item.memberId;
      // Branch from current branch name (via BranchesService)
      const branch = this.branchesService.currentBranch?.name || "";
      // Name: combine firstName and lastName.
      const name = `${item.firstName} ${item.lastName}`;
      // Mobile number.
      const mobile = item.phoneNumber || "";
      // Membership: membership name from UserMembership.
      const membership = mShip?.name || "";
      // Membership Type.
      const membershipType = mShip?.type || "";
      // Start Date, End Date, and Created At formatted to yyyy/mm/dd.
      const startDate = formatDate(mShip?.startDate || "");
      const endDate = formatDate(mShip?.endDate || "");
      const createdAt = formatDate(mShip?.createdAt || "");
      // Sales: if salesStaff exists, use its firstName and lastName; otherwise, salesId.
      const sales = mShip?.salesStaff
        ? `${mShip.salesStaff.firstName} ${mShip.salesStaff.lastName}`
        : mShip?.salesId || "";
      // Price from UserMembership.pricePaid.
      const price = mShip?.pricePaid != null ? mShip.pricePaid : "";

      const row = [
        id,
        branch,
        name,
        mobile,
        membership,
        membershipType,
        startDate,
        endDate,
        createdAt,
        sales,
        price,
      ];
      return row.map(escapeCSV).join(",");
    });

    // Calculate the total sum of all rows' price.
    const totalSum = data.reduce((sum, item) => {
      const price = item.UserMembership?.pricePaid;
      return sum + (price != null ? price : 0);
    }, 0);

    // Create a final row with the total sum in the Price column.
    // Leave other cells blank (or include a label in one of the cells).
    const totalRow = [
      "", // ID
      "", // Branch
      "", // Name
      "", // Mobile
      "", // Membership
      "", // Membership Type
      "", // Start Date
      "", // End Date
      "", // Created At
      "Total Price", // Sales column (label)
      totalSum, // Price column: total
    ];

    // Combine header, data rows, and the total row.
    return [headers.join(","), ...csvRows, totalRow.join(",")].join("\n");
  }

  /**
   * Triggers a download of the CSV file.
   *
   * @param data - The array of MemberAccount records.
   */
  downloadCSV(data: MemberAccount[]): void {
    const csvContent = this.exportToCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
