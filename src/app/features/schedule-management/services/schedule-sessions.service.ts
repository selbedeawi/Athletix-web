import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TablesInsert } from '../../../../../database.types';
import { SupabaseService } from '../../../core/services/supabase/supabase.service';
import { ScheduleSession } from '../models/schedule-session';

export type ScheduledSessionInsert = TablesInsert<'ScheduledSession'>;
export type SheduleCoachesInsert = TablesInsert<'SheduleCoaches'>;

export interface ScheduledSessionFilter {
  scheduledDateFrom?: string; // e.g., "2025-03-13"
  scheduledDateTo?: string; // e.g., "2025-03-15"
  branchId?: string;
  sessionId?: string;
  coachIds?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ScheduledSessionService {
  private supabaseService = inject(SupabaseService);

  constructor() {}

  /**
   * Add a single ScheduledSession along with its associated SheduleCoaches.
   *
   * @param session The scheduled session data to insert.
   * @param coachIds An array of coach IDs to associate with the session.
   * @returns Observable emitting the inserted session and its SheduleCoaches records.
   */
  addSingleScheduledSession(
    session: ScheduledSessionInsert,
    coachIds: string[]
  ): Observable<{
    scheduledSession: any;
    sheduleCoaches: any;
  }> {
    return from(
      this.supabaseService.sb
        .from('ScheduledSession')
        .insert([session])
        .select()
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
          })
        );
        return from(
          this.supabaseService.sb
            .from('SheduleCoaches')
            .insert(sheduleCoachesInserts)
        ).pipe(
          map((coachRes: any) => {
            if (coachRes.error) {
              throw coachRes.error;
            }
            return {
              scheduledSession: insertedSession,
              sheduleCoaches: coachRes.data,
            };
          })
        );
      })
    );
  }

  /**
   * Add multiple ScheduledSessions along with their associated SheduleCoaches.
   *
   * @param sessions An array of objects, each containing a scheduled session and its associated coach IDs.
   * @returns Observable emitting the inserted sessions and their SheduleCoaches records.
   */
  addMultipleScheduledSessions(
    sessions: { session: ScheduledSessionInsert; coachIds: string[] }[]
  ): Observable<{
    scheduledSessions: any[];
    sheduleCoaches: any[];
  }> {
    const sessionData = sessions.map((item) => item.session);
    return from(
      this.supabaseService.sb
        .from('ScheduledSession')
        .insert(sessionData)
        .select()
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
            .from('SheduleCoaches')
            .insert(sheduleCoachesInserts)
        ).pipe(
          map((coachRes: any) => {
            if (coachRes.error) {
              throw coachRes.error;
            }
            return {
              scheduledSessions: insertedSessions,
              sheduleCoaches: coachRes.data,
            };
          })
        );
      })
    );
  }

  // filterScheduledSessions(
  //   filters: ScheduledSessionFilter,
  //   page: number = 1,
  //   pageSize: number = 10,
  // ): Observable<ScheduleSession[]> {
  //   const start = (page - 1) * pageSize;
  //   const end = start + pageSize - 1;

  //   // Query from the flattened view.
  //   let query = this.supabaseService.sb
  //     .from("ScheduledSession")
  //     .select("*,SheduleCoaches!inner(*)", { count: "exact" })
  //     .range(start, end);

  //   // Apply scheduledDate range filters if provided.
  //   if (filters.scheduledDateFrom) {
  //     const d = new Date(filters.scheduledDateFrom);
  //     query = query.gte(
  //       "scheduledDate",
  //       `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
  //     );
  //   }
  //   if (filters.scheduledDateTo) {
  //     const d = new Date(filters.scheduledDateTo);
  //     query = query.lte(
  //       "scheduledDate",
  //       `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
  //     );
  //   }
  //   // Filter by branchId if provided.
  //   if (filters.branchId) {
  //     query = query.eq("branchId", filters.branchId);
  //   }
  //   // Filter by sessionId if provided.
  //   if (filters.sessionId) {
  //     query = query.eq("sessionId", filters.sessionId);
  //   }
  //   // // Filter by scheduled time range.
  //   // if (filters.scheduledTimeFrom) {
  //   //   query = query.gte("startTime", filters.scheduledTimeFrom);
  //   // }
  //   // if (filters.scheduledTimeTo) {
  //   //   query = query.lte("startTime", filters.scheduledTimeTo);
  //   // }

  //   // Filter by coachIds using the inner join on SheduleCoaches.
  //   if (filters.coachIds && filters.coachIds.length > 0) {
  //     query = query.in("SheduleCoaches.coachId", filters.coachIds);
  //   }

  //   return from(query).pipe(
  //     map((res: any) => {
  //       if (res.error) {
  //         throw res.error;
  //       }
  //       return res.data;
  //     }),
  //   );
  // }

  /**
   * Filter ScheduledSessions based on scheduledDate range, branchId, sessionId, and coachIds.
   *
   * @param filters Filter options to apply.
   * @returns Observable emitting the filtered sessions with their associated SheduleCoaches.
   */
  filterScheduledSessions(
    filters: ScheduledSessionFilter
  ): Observable<ScheduleSession[]> {
    // Start with the base query, including the related SheduleCoaches.
    let query = this.supabaseService.sb
      .from('ScheduledSession')
      .select('*,Sessions(*), SheduleCoaches!inner(*)');

    // Apply scheduledDate range filters if provided.
    if (filters.scheduledDateFrom) {
      const d = new Date(filters.scheduledDateFrom);
      query = query.gte(
        'scheduledDate',
        `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
      );
    }
    if (filters.scheduledDateTo) {
      const d = new Date(filters.scheduledDateTo);
      query = query.lte(
        'scheduledDate',
        `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
      );
    }
    // Filter by branchId if provided.
    if (filters.branchId) {
      query = query.eq('branchId', filters.branchId);
    }
    // Filter by sessionId if provided.
    if (filters.sessionId) {
      query = query.eq('sessionId', filters.sessionId);
    }
    // Filter by coachIds if provided.
    if (filters.coachIds && filters.coachIds.length > 0) {
      query = query.in('SheduleCoaches.coachId', filters.coachIds);
    }

    return from(query).pipe(
      map((res: any) => {
        if (res.error) {
          throw res.error;
        }
        return res.data;
      })
    );
  }

  /**
   * Cancels all bookings for a ScheduledSession and deletes the ScheduledSession.
   *
   * This function calls the `cancel_scheduled_session` RPC on the database,
   * which reverts any session deductions for associated bookings and then deletes both
   * the bookings and the ScheduledSession record.
   *
   * @param scheduledSessionId - The ID of the ScheduledSession to cancel.
   * @returns Observable emitting the result of the cancellation.
   */
  cancelScheduledSession(scheduledSessionId: string): Observable<any> {
    return from(
      this.supabaseService.sb.rpc('cancel_scheduled_session', {
        p_scheduled_session_id: scheduledSessionId,
      })
    ).pipe(
      map((res: any) => {
        if (res.error) {
          throw res.error;
        }
        return res.data;
      })
    );
  }
}
