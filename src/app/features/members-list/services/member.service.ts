import { inject, Injectable } from "@angular/core";
import { from, map, Observable } from "rxjs";
import { SupabaseService } from "../../../core/services/supabase/supabase.service";
import { BEResponse } from "../../../shared/models/shared-models";
import { MemberAccount } from "../models/member";

@Injectable({
  providedIn: "root",
})
export class MemberService {
  private supabaseService = inject(SupabaseService);
  constructor() {}

  /**
   * Create a new member by calling the Supabase Edge Function.
   * @param member A Member object containing details and password.
   * @returns An Observable with the result of the function invocation.
   */
  createMember(member: MemberAccount) {
    return from(
      this.supabaseService.sb.functions.invoke("create-member", {
        body: member,
      }),
    );
  }

  /**
   * Retrieve a member record by ID.
   * @param id The member's ID.
   * @returns Observable emitting the Member details.
   */
  getMember(id: string): Observable<MemberAccount> {
    return from(
      this.supabaseService.sb
        .from("Members")
        .select("*")
        .eq("id", id)
        .single(),
    ).pipe(
      map((res: any) => res.data),
    ) as Observable<MemberAccount>;
  }

  /**
   * Retrieve paginated member records with optional filters.
   * @param filters Filtering parameters.
   * @param page Page number (starting from 1).
   * @param pageSize Number of items per page.
   * @returns Observable emitting a paginated response of Members.
   */
  getAllMembers(
    filters: {
      searchQuery?: string;
      branchId?: string;
      membershipId?: string;
      type?: "Individual" | "PrivateCoach" | "SessionBased";
      endDateFrom?: string;
      endDateTo?: string;
      createdFrom?: string;
      createdTo?: string;
      isActive?: boolean;
    },
    page: number = 1,
    pageSize: number = 10,
  ): Observable<BEResponse<MemberAccount[]>> {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = this.supabaseService.sb
      .from("Members")
      .select("*, UserMembership!inner(*)", { count: "exact" });

    // .select("*, UserMembership!inner(*)", { count: "exact" });
    // Apply search filter across multiple fields
    if (filters.searchQuery) {
      query = query.or(
        `firstName.ilike.%${filters.searchQuery}%,lastName.ilike.%${filters.searchQuery}%,memberId.ilike.%${filters.searchQuery}%,nationalId.ilike.%${filters.searchQuery}%,phoneNumber.ilike.%${filters.searchQuery}%`,
      );
    }

    // Filter by branchId if provided
    if (filters.branchId) {
      query = query.eq("UserMembership.branchId", filters.branchId);
    }

    // Filter by membershipId if provided
    if (filters.membershipId) {
      query = query.eq("UserMembership.membershipId", filters.membershipId);
    }

    // Filter by type if provided
    if (filters.type) {
      query = query.eq("UserMembership.type", filters.type);
    }

    if (filters.endDateFrom) {
      query = query.gte("UserMembership.endDate", filters.endDateFrom);
    }
    if (filters.endDateTo) {
      query = query.lte("UserMembership.endDate", filters.endDateTo);
    }
    if (filters.endDateFrom) {
      query = query.gte("UserMembership.endDate", filters.endDateFrom);
    }
    if (filters.endDateTo) {
      query = query.lte("UserMembership.endDate", filters.endDateTo);
    }
    if (filters.createdFrom) {
      query = query.gte("UserMembership.createdAt", filters.createdFrom);
    }
    if (filters.createdTo) {
      query = query.lte("UserMembership.createdAt", filters.createdTo);
    }

    query = query.range(start, end);
    return from(query) as any;
  }

  /**
   * Update a member record.
   * @param id The member's ID.
   * @param member Partial member data to update.
   * @returns Observable with the update result.
   */
  updateMember(id: string, member: any): Observable<any> {
    return from(
      this.supabaseService.sb.from("Members").update(member).eq("id", id),
    );
  }

  /**
   * Delete a member record by ID.
   * @param id The member's ID.
   * @returns Observable with the deletion result.
   */
  deleteMember(id: string): Observable<any> {
    return from(
      this.supabaseService.sb.from("Members").delete().eq("id", id),
    );
  }
}
