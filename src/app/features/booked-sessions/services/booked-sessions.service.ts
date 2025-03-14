import { inject, Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { TablesInsert } from "../../../../../database.types";
import { SupabaseService } from "../../../core/services/supabase/supabase.service";
import { BookedSessionResponse } from "../models/session";

// Define the type for inserting into UserSessions
type UserSessionInsert = TablesInsert<"UserSessions">;

export interface BookedSessionFilter {
  // Use a single searchKey to search across member fields
  searchKey?: string;
  // Other filters:
  scheduledSessionId?: string|null;
  coachIds?: string[];
  branchId?: string;
  scheduledDateFrom?: string | null; // e.g., "2025-03-13"
  scheduledDateTo?: string; // e.g., "2025-03-15"
}

@Injectable({
  providedIn: "root",
})
export class BookedSessionsService {
  private supabaseService = inject(SupabaseService);

  constructor() {
    // Example test data for booking a session
    const bookingData: UserSessionInsert = {
      bookingDate: new Date().toISOString(), // Booking date as an ISO string
      createdAt: new Date().toISOString(), // Creation timestamp
      branchId: "78461fa1-90e2-4425-819e-0d384cec0b6d",
      scheduledSessionId: "addbe7a7-78f3-4fc9-9084-a1b6143bb50d",
      userMemberShipId: "a3b002cb-fe56-4c91-bad2-3ebe31098033",
    };

    // Uncomment to test booking a session:
    // this.bookSession(bookingData).subscribe((res) => console.log(res));
  }

  /**
   * Books a session by inserting a record into the UserSessions table.
   *
   * @param booking The booking details.
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
   * Filters booked sessions based on a search key for member details, scheduled session,
   * coach, branchId, and scheduled date range.
   *
   * The query assumes:
   * - A join from UserSessions to ScheduledSession (via scheduledSessionId).
   * - A join from UserSessions to UserMembership and then to Members for member details.
   * - A join from ScheduledSession to SheduleCoaches for coach filtering.
   *
   * Adjust the joined table names if they differ from your schema.
   *
   * @param filters Filter options to apply.
   * @returns Observable emitting the filtered booked sessions.
   */
  filterBookedSessions(filters: BookedSessionFilter): Observable<BookedSessionResponse[]> {
    // Build the base query with joins.
    let query = this.supabaseService.sb
      .from("UserSessions")
      .select(`
        *,
        ScheduledSession (
          *,
          SheduleCoaches ( coachId )
        ),
        UserMembership (
          *,
          Members ( firstName, lastName, phoneNumber, memberId )
        )
      `);

    // Use searchKey to filter across member details.
    if (filters.searchKey) {
      const searchPattern = `%${filters.searchKey}%`;
      query = query.or(
        `UserMembership.Members.firstName.ilike.${searchPattern},` +
          `UserMembership.Members.lastName.ilike.${searchPattern},` +
          `UserMembership.Members.phoneNumber.ilike.${searchPattern},` +
          `UserMembership.Members.memberId.ilike.${searchPattern}`,
      );
    }

    // Filter by scheduled session ID.
    if (filters.scheduledSessionId) {
      query = query.eq("scheduledSessionId", filters.scheduledSessionId);
    }

    // Filter by branchId.
    if (filters.branchId) {
      query = query.eq("branchId", filters.branchId);
    }

    // Filter by scheduled date range from the ScheduledSession join.
    if (filters.scheduledDateFrom) {
      query = query.gte(
        "ScheduledSession.scheduledDate",
        filters.scheduledDateFrom,
      );
    }
    if (filters.scheduledDateTo) {
      query = query.lte(
        "ScheduledSession.scheduledDate",
        filters.scheduledDateTo,
      );
    }

    // Filter by coachIds (using the joined ScheduledSession.SheduleCoaches).
    if (filters.coachIds && filters.coachIds.length > 0) {
      query = query.in(
        "ScheduledSession.SheduleCoaches.coachId",
        filters.coachIds,
      );
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
}
