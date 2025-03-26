import { inject, Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SupabaseService } from "../../../core/services/supabase/supabase.service";
import { TablesInsert } from "../../../../../database.types";

// Define the type for inserting into PrivateSessionsBooking.
export type PrivateSessionsBookingInsert = TablesInsert<
  "PrivateSessionsBooking"
>;

export interface PrivateSessionBookingFilter {
  /** A search key to match across member or coach details. */
  searchKey?: string;
  /** Filter for bookingDate greater than or equal to this ISO date string. */
  bookingDateFrom?: string;
  /** Filter for bookingDate less than or equal to this ISO date string. */
  bookingDateTo?: string;
  /** Filter by branchId (from the booking). */
  branchId?: string;
  /** Filter by coachId (from the booking). */
  coachId?: string;
  /** Filter by userMembershipId. */
  userMembershipId?: string;
  bookingTimeTo?: string | null;
  bookingTimeFrom?: string | null;
  bookingSessionId?: string;
}

@Injectable({
  providedIn: "root",
})
export class PrivateSessionsBookingService {
  private supabaseService = inject(SupabaseService);

  /**
   * Creates a private session booking by inserting a record into the PrivateSessionsBooking table.
   *
   * @param booking - The booking details to insert.
   * @returns Observable emitting the inserted booking record.
   */
  createPrivateSessionBooking(
    booking: PrivateSessionsBookingInsert,
  ) {
    return from(
      this.supabaseService.sb
        .from("PrivateSessionsBooking")
        .insert(booking)
        .select(),
    );
  }

  /**
   * Filters private session bookings using the flattened view.
   *
   * This query uses the 'flattened_private_sessions_booking' view which flattens data from:
   * - PrivateSessionsBooking
   * - Branch (for branch details)
   * - Staff (for coach details)
   * - UserMembership and Members (for membership and member details)
   *
   * @param filters - Filter options to apply.
   * @returns Observable emitting an array of matching private session booking records.
   */
  filterPrivateSessionsBooking(
    filters: PrivateSessionBookingFilter,
    page: number = 1,
    pageSize: number = 10,
  ) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = this.supabaseService.sb
      .from("flattened_private_sessions_booking")
      .select("*", { count: "exact" });

    // Build the OR filter for searching across member and coach details.
    if (filters.searchKey) {
      const pattern = `%${filters.searchKey}%`;
      const searchFilter = [
        `member_firstname.ilike.${pattern}`,
        `member_lastname.ilike.${pattern}`,
        `member_email.ilike.${pattern}`,
        `member_memberid.ilike.${pattern}`,
        `member_nationalid.ilike.${pattern}`,
        `member_phonenumber.ilike.${pattern}`,
        `coach_firstname.ilike.${pattern}`,
        `coach_lastname.ilike.${pattern}`,
      ].join(",");
      query = query.or(searchFilter);
    }

    // Apply additional filters.
    if (filters.bookingDateFrom) {
      query = query.gte(
        "bookingDate",
        this.formatDate(filters.bookingDateFrom as any),
      );
    }
    if (filters.bookingDateTo) {
      query = query.lte(
        "bookingDate",
        this.formatDate(filters.bookingDateTo as any),
      );
    }

    if (filters.bookingTimeFrom) {
      query = query.gte(
        "time",
        filters.bookingTimeFrom,
      );
    }
    if (filters.bookingTimeTo) {
      query = query.lte(
        "time",
        filters.bookingTimeTo,
      );
    }

    if (filters.branchId) {
      query = query.eq("booking_branchid", filters.branchId);
    }
    if (filters.coachId) {
      query = query.eq("coachId", filters.coachId);
    }
    if (filters.userMembershipId) {
      query = query.eq("usermembershipid", filters.userMembershipId);
    }
    query = query.range(start, end);
    return from(query);
  }

  /**
   * Deletes a private session booking by its primary key (id).
   *
   * @param bookingId - The id of the booking to delete.
   * @returns Observable emitting the deleted booking record.
   */
  deletePrivateSessionBooking(bookingId: string): Observable<any> {
    return from(
      this.supabaseService.sb.rpc("cancel_private_session", {
        p_booking_id: bookingId,
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
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    // Months are 0-based so we add 1
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  }
}
