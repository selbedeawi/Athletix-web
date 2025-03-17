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
  scheduledSessionId?: string | null;
  /** Filter by an array of coach IDs. */
  coachIds?: string[];
  /** Filter by branch ID (uses the session branch from the view). */
  branchId?: string;
  /** Filter sessions with a scheduled date on or after this value (ISO string). */
  scheduledDateFrom?: string | null;
  /** Filter sessions with a scheduled date on or before this value (ISO string). */
  scheduledDateTo?: string| null;
  scheduledTimeTo?: string| null;
  scheduledTimeFrom?: string| null;
}

@Injectable({
  providedIn: "root",
})
export class BookedSessionsService {
  private supabaseService = inject(SupabaseService);

  constructor() {
    // Example test data for booking a session.
    const bookingData: UserSessionInsert = {
      bookingDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      branchId: "78461fa1-90e2-4425-819e-0d384cec0b6d",
      scheduledSessionId: "addbe7a7-78f3-4fc9-9084-a1b6143bb50d",
      userMemberShipId: "a3b002cb-fe56-4c91-bad2-3ebe31098033",
    };

    // Uncomment to test booking a session:
    // this.bookSession(bookingData).subscribe(result => console.log(result));
  }

  /**
   * Books a session by inserting a record into the UserSessions table.
   *
   * @param booking - The booking details.
   * @returns Observable emitting the inserted booking record.
   */
  bookSession(booking: UserSessionInsert): Observable<any> {
    return from(
      this.supabaseService.sb
        .from("UserSessions")
        .insert([booking])
        .select(),
    ).pipe(
      map((res: any) => {
        if (res.error) {
          throw res.error;
        }
        return res.data[0];
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
  ) {
    // Query from the flattened view.
    let query = this.supabaseService.sb
      .from("flattened_user_sessions_full")
      .select("*");

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
    if (filters.scheduledSessionId) {
      query = query.eq("scheduledSessionId", filters.scheduledSessionId);
    }

    // Filter by branch ID (using the alias from UserSessions in the view).
    if (filters.branchId) {
      query = query.eq("user_session_branchId", filters.branchId);
    }

    // Filter by scheduled date range (from the ScheduledSession join).
    if (filters.scheduledDateFrom) {
      query = query.gte("scheduledDate", filters.scheduledDateFrom);
    }
    if (filters.scheduledDateTo) {
      query = query.lte("scheduledDate", filters.scheduledDateTo);
    }

    // Filter by coach IDs (using the flattened coach ID from SheduleCoaches).
    if (filters.coachIds && filters.coachIds.length > 0) {
      query = query.in("shedule_coachId", filters.coachIds);
    }

    return from(query).pipe(
      map((res: any) => {
        if (res.error) {
          throw res.error;
        }
        return res.data;
      }),
    );
  }
  /**
   * Deletes a session from the UserSessions table by its primary key (id).
   *
   * @param sessionId - The primary key (id) of the session to delete.
   * @returns Observable emitting the deleted session record.
   */
  deleteSession(sessionId: string) {
    return from(
      this.supabaseService.sb
        .from("UserSessions")
        .delete()
        .eq("id", sessionId)
        .select(),
    ).pipe(
      map((res) => {
        if (res.error) {
          throw res.error;
        }
        // res.data will be an array of deleted records. Typically just one if the id is unique.
        return res.data[0];
      }),
    );
  }
}
