import { inject, Injectable } from "@angular/core";
import { from, map, Observable } from "rxjs";
import { SupabaseService } from "../../../core/services/supabase/supabase.service";
import { BEResponse } from "../../../shared/models/shared-models";

@Injectable({
  providedIn: "root",
})
export class UserMembershipService {
  private supabaseService = inject(SupabaseService);
  constructor() {}

  /**
   * Create a new user membership.
   * @param membership A UserMembership object containing details.
   * @returns An Observable with the result of the function invocation.
   */
  createUserMembership(membership: any) {
    return from(
      this.supabaseService.sb.from("UserMembership").insert(membership),
    );
  }

  /**
   * Retrieve a user membership record by ID.
   * @param id The user membership ID.
   * @returns Observable emitting the UserMembership details.
   */
  getUserMembership(id: string): Observable<any> {
    return from(
      this.supabaseService.sb
        .from("UserMembership")
        .select("*")
        .eq("id", id)
        .single(),
    ).pipe(
      map((res: any) => res.data),
    );
  }

  /**
   * Retrieve a user membership record by ID.
   * @param id The user membership ID.
   * @returns Observable emitting the UserMembership details.
   */
  getMembershipByUserId(
    memberId: string,
    isActive?: boolean,
    isFreeze?: boolean,
  ) {
    let query = this.supabaseService.sb
      .from("UserMembership")
      .select("*, Members(*)")
      .eq("memberId", memberId);

    if (typeof isActive === "boolean") {
      query.eq("isActive", isActive);
    }
    if (typeof isFreeze === "boolean") {
      query.eq("isFreeze", isFreeze);
    }

    return from(
      query,
    ).pipe(
      map((res) => res.data),
    );
  }

  /**
   * Retrieve paginated user membership records with optional filters.
   * @param filters Filtering parameters.
   * @param page Page number (starting from 1).
   * @param pageSize Number of items per page.
   * @returns Observable emitting a paginated response of UserMemberships.
   */
  getAllUserMemberships(
    filters: {
      memberId?: string;
      membershipId?: string;
      isActive?: boolean | "All";
    },
    page: number = 1,
    pageSize: number = 10,
  ): Observable<BEResponse<any[]>> {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = this.supabaseService.sb.from("UserMembership").select("*", {
      count: "exact",
    });

    if (filters.memberId) {
      query = query.eq("memberId", filters.memberId);
    }
    if (filters.membershipId) {
      query = query.eq("membershipId", filters.membershipId);
    }
    if (filters.isActive !== undefined && filters.isActive !== "All") {
      query = query.eq("isActive", filters.isActive);
    }
    query = query.range(start, end);
    return from(query) as any;
  }

  /**
   * Update a user membership record.
   * @param id The user membership ID.
   * @param membership Partial user membership data to update.
   * @returns Observable with the update result.
   */
  updateUserMembership(id: string, membership: any): Observable<any> {
    return from(
      this.supabaseService.sb.from("UserMembership").update(membership).eq(
        "id",
        id,
      ),
    );
  }

  /**
   * Delete a user membership record by ID.
   * @param id The user membership ID.
   * @returns Observable with the deletion result.
   */
  deleteUserMembership(id: string): Observable<any> {
    return from(
      this.supabaseService.sb.from("UserMembership").delete().eq("id", id),
    );
  }
}
