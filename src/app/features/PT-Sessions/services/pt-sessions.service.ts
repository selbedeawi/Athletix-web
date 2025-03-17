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
  bookingTimeTo?: string| null;
  bookingTimeFrom?: string| null;
  bookingSessionId?:string
}

@Injectable({
  providedIn: "root",
})
export class PrivateSessionsBookingService {
  private supabaseService = inject(SupabaseService);

  constructor() {
    // Example test data for booking a private session:
    const testBooking: PrivateSessionsBookingInsert = {
      bookingDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      branchId: "78461fa1-90e2-4425-819e-0d384cec0b6d",
      coachId: "d8e032df-b32c-4152-9bcc-fc74f5641470",
      time: "10:00",
      userMembershipId: "14099190-a36f-4349-8ec3-2c5e3175ed25",
    };
    this.createPrivateSessionBooking(testBooking).subscribe(console.log);
  }

  /**
   * Creates a private session booking by inserting a record into the PrivateSessionsBooking table.
   *
   * @param booking - The booking details to insert.
   * @returns Observable emitting the inserted booking record.
   */
  createPrivateSessionBooking(
    booking: PrivateSessionsBookingInsert,
  ): Observable<any> {
    return from(
      this.supabaseService.sb
        .from("PrivateSessionsBooking")
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
  ): Observable<any[]> {
    let query = this.supabaseService.sb
      .from("flattened_private_sessions_booking")
      .select("*");

    // Build the OR filter for searching across member and coach details.
    if (filters.searchKey) {
      const pattern = `%${filters.searchKey}%`;
      const searchFilter = [
        `member_firstname.ilike.${pattern}`,
        `member_lastname.ilike.${pattern}`,
        `coach_firstname.ilike.${pattern}`,
        `coach_lastname.ilike.${pattern}`,
      ].join(",");
      query = query.or(searchFilter);
    }

    // Apply additional filters.
    if (filters.bookingDateFrom) {
      query = query.gte("bookingdate", filters.bookingDateFrom);
    }
    if (filters.bookingDateTo) {
      query = query.lte("bookingdate", filters.bookingDateTo);
    }
    if (filters.branchId) {
      query = query.eq("booking_branchid", filters.branchId);
    }
    if (filters.coachId) {
      query = query.eq("coachid", filters.coachId);
    }
    if (filters.userMembershipId) {
      query = query.eq("usermembershipid", filters.userMembershipId);
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
   * Deletes a private session booking by its primary key (id).
   *
   * @param bookingId - The id of the booking to delete.
   * @returns Observable emitting the deleted booking record.
   */
  deletePrivateSessionBooking(bookingId: number): Observable<any> {
    return from(
      this.supabaseService.sb
        .from("PrivateSessionsBooking")
        .delete()
        .eq("id", bookingId)
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
}
