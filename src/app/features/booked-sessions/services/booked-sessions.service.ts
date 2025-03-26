import { inject, Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { TablesInsert } from "../../../../../database.types";
import { SupabaseService } from "../../../core/services/supabase/supabase.service";

// Define the type for inserting into UserSessions
export type UserSessionInsert = TablesInsert<"UserSessions">;

export interface BookedSessionFilter {
  /** A search key to match against member details. */
  searchKey?: string;
  /** Filter by a specific scheduled session ID. */
  scheduledSessionId: string;

  sessionId?: string;
  /** Filter by an array of coach IDs. */
  coachIds?: string[];
  /** Filter by branch ID (uses the session branch from the view). */
  branchId?: string;
  /** Filter sessions with a scheduled date on or after this value (ISO string). */
  scheduledDateFrom?: string | null;
  /** Filter sessions with a scheduled date on or before this value (ISO string). */
  scheduledDateTo?: string | null;
  scheduledTimeTo?: string | null;
  scheduledTimeFrom?: string | null;
}

@Injectable({
  providedIn: "root",
})
export class BookedSessionsService {
  private supabaseService = inject(SupabaseService);

  /**
   * Books a "SessionBased" session by calling a PostgreSQL function that:
   *   a. Checks for membership type "SessionBased".
   *   b. Checks and deducts from remainingGroupSessions.
   *   c. Inserts a new record into UserSessions.
   *
   * @param booking - The booking details.
   * @param membershipId - The UserMembership ID to update.
   * @returns Observable emitting the result from the RPC.
   */
  bookSession(
    booking: UserSessionInsert,
    membershipId: string,
  ): Observable<any> {
    return from(
      this.supabaseService.sb.rpc("book_session", {
        p_branch_id: booking.branchId as any,
        p_scheduled_session_id: booking.scheduledSessionId,
        p_membership_id: membershipId,
      }),
    ).pipe(
      map((res: any) => {
        if (res.error) {
          throw res.error;
        }
        return res.data;
      }),
    );
  }

  /**
   * Filters booked sessions using the flattened view.
   *
   * This query uses the `flattened_user_sessions_full` view, which flattens data from:
   * - UserSessions
   * - UserMembership
   * - Members
   * - ScheduledSession
   * - SheduleCoaches
   *
   * You can filter on member details (firstName, lastName, member_memberId, nationalId, phoneNumber)
   * and other session-specific filters.
   *
   * @param filters - Filter options to apply.
   * @returns Observable emitting an array of booked session responses.
   */
  filterBookedSessions(
    filters: BookedSessionFilter,
    page: number = 1,
    pageSize: number = 10,
  ) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    // Query from the flattened view.
    let query = this.supabaseService.sb
      .from("flattened_user_sessions_full")
      .select("*", { count: "exact" });

    // Build the OR filter to search across member details.
    if (filters.searchKey) {
      const pattern = `%${filters.searchKey}%`;
      const searchFilter = [
        `firstName.ilike.${pattern}`,
        `lastName.ilike.${pattern}`,
        `member_memberid.ilike.${pattern}`,
        `nationalId.ilike.${pattern}`,
        `phoneNumber.ilike.${pattern}`,
      ].join(",");
      query = query.or(searchFilter);
    }

    // Filter by scheduled session ID.
    if (filters.sessionId) {
      query = query.eq("sessionId", filters.sessionId);
    }

    // Filter by branch ID (using the alias from UserSessions in the view).
    if (filters.branchId) {
      query = query.eq("user_session_branchid", filters.branchId);
    }

    // Filter by scheduled date range (from the ScheduledSession join).
    // Apply scheduledDate range filters if provided.
    if (filters.scheduledDateFrom) {
      const d = new Date(filters.scheduledDateFrom);
      query = query.gte(
        "scheduledDate",
        `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
      );
    }
    if (filters.scheduledDateTo) {
      const d = new Date(filters.scheduledDateTo);
      query = query.lte(
        "scheduledDate",
        `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
      );
    }
    if (filters.scheduledTimeFrom) {
      query = query.gte("startTime", filters.scheduledTimeFrom);
    }
    if (filters.scheduledTimeTo) {
      query = query.lte("startTime", filters.scheduledTimeTo);
    }
    // Filter by coach IDs (using the flattened coach ID from SheduleCoaches).
    if (filters.coachIds && filters.coachIds.length > 0) {
      query = query.in("shedule_coachId", filters.coachIds);
    }
    query = query.range(start, end);
    return from(query);
  }
  /**
   * Cancels (reverts and deletes) a session from the UserSessions table
   * by calling the cancel_book_session SQL function.
   *
   * @param sessionId - The primary key (id) of the session to cancel.
   * @returns Observable emitting the canceled session record,
   *          including the updated remaining group sessions (if applicable).
   */
  deleteSession(sessionId: string) {
    return from(
      this.supabaseService.sb.rpc("cancel_book_session", {
        p_user_session_id: sessionId,
      }),
    ).pipe(
      map((res: any) => {
        if (res.error) {
          throw res.error;
        }
        // res.data will be an array with the canceled session record,
        // typically just one record.
        return res.data[0];
      }),
    );
  }
}
