import { inject, Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { TablesInsert } from "../../../../../database.types";
import { SupabaseService } from "../../../core/services/supabase/supabase.service";
import { ScheduleSession } from "../models/schedule-session";

type ScheduledSessionInsert = TablesInsert<"ScheduledSession">;
type SheduleCoachesInsert = TablesInsert<"SheduleCoaches">;

export interface ScheduledSessionFilter {
  scheduledDateFrom?: string; // e.g., "2025-03-13"
  scheduledDateTo?: string; // e.g., "2025-03-15"
  branchId?: string;
  sessionId?: string;
  coachIds?: string[];
}

@Injectable({
  providedIn: "root",
})
export class ScheduledSessionService {
  private supabaseService = inject(SupabaseService);

  constructor() {
    // Single ScheduledSession insert test data
    const testSingleSession: ScheduledSessionInsert = {
      sessionId: "2c112f80-0025-459d-a076-bdafed5d7eb2",
      createdAt: new Date().toISOString(),
      startTime: "14:00:00",
      endTime: "15:00:00",
      scheduledDate: new Date().toISOString(),
      branchId: "78461fa1-90e2-4425-819e-0d384cec0b6d",
      createdBy: "e6df3674-078b-4f75-80c9-5c4609ac20ac",
    };

    const testSingleCoachIds = ["d8e032df-b32c-4152-9bcc-fc74f5641470"];

    // Uncomment to test single insert
    // this.addSingleScheduledSession(testSingleSession, testSingleCoachIds)
    //   .subscribe((res) => console.log(res));

    //   this.filterScheduledSessions({})
    //     .subscribe((res) => console.log(res));
  }

  /**
   * Add a single ScheduledSession along with its associated SheduleCoaches.
   *
   * @param session The scheduled session data to insert.
   * @param coachIds An array of coach IDs to associate with the session.
   * @returns Observable emitting the inserted session and its SheduleCoaches records.
   */
  addSingleScheduledSession(
    session: ScheduledSessionInsert,
    coachIds: string[],
  ): Observable<{
    scheduledSession: any;
    sheduleCoaches: any;
  }> {
    return from(
      this.supabaseService.sb
        .from("ScheduledSession")
        .insert([session])
        .select(),
    ).pipe(
      switchMap((res: any) => {
        if (res.error) {
          throw res.error;
        }
        // Assuming a single record was returned
        const insertedSession = res.data[0];
        const sessionId = insertedSession.id;
        const sheduleCoachesInserts: SheduleCoachesInsert[] = coachIds.map(
          (coachId) => ({
            coachId,
            scheduledSessionId: sessionId,
          }),
        );
        return from(
          this.supabaseService.sb
            .from("SheduleCoaches")
            .insert(sheduleCoachesInserts),
        ).pipe(
          map((coachRes: any) => {
            if (coachRes.error) {
              throw coachRes.error;
            }
            return {
              scheduledSession: insertedSession,
              sheduleCoaches: coachRes.data,
            };
          }),
        );
      }),
    );
  }

  /**
   * Add multiple ScheduledSessions along with their associated SheduleCoaches.
   *
   * @param sessions An array of objects, each containing a scheduled session and its associated coach IDs.
   * @returns Observable emitting the inserted sessions and their SheduleCoaches records.
   */
  addMultipleScheduledSessions(
    sessions: { session: ScheduledSessionInsert; coachIds: string[] }[],
  ): Observable<{
    scheduledSessions: any[];
    sheduleCoaches: any[];
  }> {
    const sessionData = sessions.map((item) => item.session);
    return from(
      this.supabaseService.sb
        .from("ScheduledSession")
        .insert(sessionData)
        .select(),
    ).pipe(
      switchMap((res: any) => {
        if (res.error) {
          throw res.error;
        }
        const insertedSessions = res.data;
        let sheduleCoachesInserts: SheduleCoachesInsert[] = [];
        sessions.forEach((item, index) => {
          const sessionId = insertedSessions[index].id;
          const coachRows = item.coachIds.map((coachId) => ({
            coachId,
            scheduledSessionId: sessionId,
          }));
          sheduleCoachesInserts = sheduleCoachesInserts.concat(coachRows);
        });
        return from(
          this.supabaseService.sb
            .from("SheduleCoaches")
            .insert(sheduleCoachesInserts),
        ).pipe(
          map((coachRes: any) => {
            if (coachRes.error) {
              throw coachRes.error;
            }
            return {
              scheduledSessions: insertedSessions,
              sheduleCoaches: coachRes.data,
            };
          }),
        );
      }),
    );
  }

  /**
   * Filter ScheduledSessions based on scheduledDate range, branchId, sessionId, and coachIds.
   *
   * @param filters Filter options to apply.
   * @returns Observable emitting the filtered sessions with their associated SheduleCoaches.
   */
  filterScheduledSessions(
    filters: ScheduledSessionFilter,
  ): Observable<ScheduleSession[]> {
    // Start with the base query, including the related SheduleCoaches.
    let query = this.supabaseService.sb
      .from("ScheduledSession")
      .select("*,Sessions(*), SheduleCoaches(*, Staff(firstName, lastName))");

    // Apply scheduledDate range filters if provided.
    if (filters.scheduledDateFrom) {
      query = query.gte("scheduledDate", filters.scheduledDateFrom);
    }
    if (filters.scheduledDateTo) {
      query = query.lte("scheduledDate", filters.scheduledDateTo);
    }
    // Filter by branchId if provided.
    if (filters.branchId) {
      query = query.eq("branchId", filters.branchId);
    }
    // Filter by sessionId if provided.
    if (filters.sessionId) {
      query = query.eq("sessionId", filters.sessionId);
    }
    // Filter by coachIds if provided.
    if (filters.coachIds && filters.coachIds.length > 0) {
      // Use the .in operator on the joined SheduleCoaches table.
      query = query.in("SheduleCoaches.coachId", filters.coachIds);
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
