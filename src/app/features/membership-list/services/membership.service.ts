import { inject, Injectable } from "@angular/core";

import { from, Observable, throwError } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { SupabaseService } from "../../../core/services/supabase/supabase.service";
import { Memberships, MembershipType } from "../models/membership";

@Injectable({
  providedIn: "root",
})
export class MembershipService {
  private supabaseService = inject(SupabaseService);
  constructor() {}

  /**
   * Create a new membership record.
   * @param membership A Membership object containing details.
   * @returns An Observable with the result of the function invocation.
   */
  createMembership(
    membership: Memberships,
    branchIds: string[],
  ): Observable<any> {
    return from(
      this.supabaseService.sb.from("Memberships").insert(membership).select(
        "id",
      ),
    ).pipe(
      switchMap(({ data, error }) => {
        if (error || !data.length) {
          return throwError(() =>
            error || new Error("Failed to create membership")
          );
        }

        const membershipId = data[0].id;
        const branchInserts = branchIds.map((branchId: string) => ({
          membershipId,
          branchId,
        }));

        return from(
          this.supabaseService.sb.from("MembershipBranches").insert(
            branchInserts,
          ),
        );
      }),
    );
  }

  /**
   * Retrieve a membership record by ID.
   * @param id The membership ID.
   * @returns Observable emitting the Membership details.
   */
  getMembership(id: string): Observable<any> {
    return from(
      this.supabaseService.sb
        .from("Memberships")
        .select("*, MembershipBranches(branchId)")
        .eq("id", id)
        .single(),
    ).pipe(
      map((res: any) => {
        res.data.branchIds = res.data.MembershipBranches?.map(
          (branch: any) => branch.branchId,
        ) || [];
        return res.data;
      }),
    );
  }

  /**
   * Retrieve paginated membership records with optional filters.
   * @param filters Filtering parameters.
   * @param page Page number (starting from 1).
   * @param pageSize Number of items per page.
   * @returns Observable emitting a paginated response of Memberships.
   */
  getAllMemberships(
    filters: {
      name?: string;
      type?: string | null;
      branchIds?: string[];
    },
    page: number = 1,
    pageSize: number = 10,
  ) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = this.supabaseService.sb
      .from("Memberships")
      .select("*, MembershipBranches(branchId, Branch(name))", {
        count: "exact",
      })
      .order("name", { ascending: true })
      .range(start, end);

    if (filters.name) {
      query = query.ilike("name", `%${filters.name}%`);
    }
    if (filters.type && filters.type !== "All") {
      query = query.eq("type", filters.type as MembershipType);
    }
    if (filters.branchIds && filters.branchIds.length > 0) {
      return from(
        this.supabaseService.sb
          .from("MembershipBranches")
          .select("membershipId")
          .in("branchId", filters.branchIds),
      ).pipe(
        switchMap(({ data, error }) => {
          if (error) {
            return throwError(() => error);
          }
          const membershipIds = data?.map((item) => item.membershipId) || [];
          if (membershipIds.length === 0) {
            return from([{ data: [], error: null }]);
          }
          return from(query.in("id", membershipIds));
        }),
      );
    }
    return from(query);
  }
  getAllMemberships2(
    filters: {
      name?: string;
      type?: string | null;
      branchIds?: string[];
    },
    page: number = 1,
    pageSize: number = 10,
  ) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = this.supabaseService.sb
      .from("Memberships")
      .select("*, MembershipBranches(branchId, Branch(name))", {
        count: "exact",
      })
      .order("name", { ascending: true })
      .range(start, end);

    if (filters.name) {
      query = query.ilike("name", `%${filters.name}%`);
    }
    if (filters.type && filters.type !== "All") {
      query = query.eq("type", filters.type as MembershipType);
    }
    if (filters.branchIds && filters.branchIds.length > 0) {
      return from(
        this.supabaseService.sb
          .from("MembershipBranches")
          .select("membershipId")
          .in("branchId", filters.branchIds),
      ).pipe(
        switchMap(({ data, error }) => {
          if (error) {
            return throwError(() => error);
          }
          const membershipIds = data?.map((item) => item.membershipId) || [];
          if (membershipIds.length === 0) {
            return from([{ data: [], error: null }]);
          }
          return from(query.in("id", membershipIds));
        }),
      );
    }
    return from(query);
  }

  /**
   * Update a membership record along with its associated branches.
   * @param id The membership ID.
   * @param membership Partial membership data to update.
   * @returns Observable with the update result.
   */
  updateMembership(
    id: string,
    membership: any,
    branchIds: string[],
  ): Observable<any> {
    return from(
      this.supabaseService.sb.from("Memberships").update(membership).eq(
        "id",
        id,
      ),
    ).pipe(
      switchMap(({ error }) => {
        if (error) {
          return throwError(() => error);
        }

        return from(
          this.supabaseService.sb.from("MembershipBranches").delete().eq(
            "membershipId",
            id,
          ),
        ).pipe(
          switchMap(() => {
            const branchInserts = branchIds.map((branchId: string) => ({
              membershipId: id,
              branchId,
            }));
            return from(
              this.supabaseService.sb.from("MembershipBranches").insert(
                branchInserts,
              ),
            );
          }),
        );
      }),
    );
  }

  /**
   * Delete a membership record by ID.
   * @param id The membership ID.
   * @returns Observable with the deletion result.
   */
  deleteMembership(id: string): Observable<any> {
    return from(
      this.supabaseService.sb.from("Memberships").delete().eq("id", id),
    );
  }
}
