import { inject, Injectable } from "@angular/core";

import { from, Observable, throwError } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { SupabaseService } from "../../../core/services/supabase/supabase.service";
import { Sessions } from "../models/sessions";
import { BEResponse } from "../../../shared/models/shared-models";

@Injectable({
  providedIn: "root",
})
export class SessionService {
  private supabaseService = inject(SupabaseService);
  constructor() {}

  /**
   * Create a new session record.
   * @param session A Session object containing details.
   * @returns An Observable with the result of the function invocation.
   */
  createSession(
    session: Sessions,
    branchIds: string[],
  ): Observable<any> {
    return from(
      this.supabaseService.sb.from("Sessions").insert(session).select(
        "id",
      ),
    ).pipe(
      switchMap(({ data, error }) => {
        if (error || !data.length) {
          return throwError(() =>
            error || new Error("Failed to create sessions")
          );
        }

        const sessionId = data[0].id;
        const branchInserts = branchIds.map((branchId: string) => ({
          sessionId,
          branchId,
        }));

        return from(
          this.supabaseService.sb.from("SessionsBranches").insert(
            branchInserts,
          ),
        );
      }),
    );
  }

  /**
   * Retrieve a session record by ID.
   * @param id The session ID.
   * @returns Observable emitting the sessions details.
   */
  getSession(id: string): Observable<any> {
    return from(
      this.supabaseService.sb
        .from("Sessions")
        .select("*, SessionsBranches(branchId)")
        .eq("id", id)
        .single(),
    ).pipe(
      map((res: any) => {
        res.data.branchIds = res.data.SessionsBranches?.map(
          (branch: any) => branch.branchId,
        ) || [];
        return res.data;
      }),
    );
  }

  /**
   * Retrieve paginated sessions records with optional filters.
   * @param filters Filtering parameters.
   * @param page Page number (starting from 1).
   * @param pageSize Number of items per page.
   * @returns Observable emitting a paginated response of sessions.
   */
  getAllSessions(
    filters: {
      name?: string;
      type?: string | null;
      branchIds?: string[];
    },
    page: number = 1,
    pageSize: number = 10,
  ): Observable<BEResponse<Sessions[]>> {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = this.supabaseService.sb
      .from("Sessions")
      .select("*, SessionsBranches(branchId, Branch(name))", {
        count: "exact",
      })
      .order("name", { ascending: true })
      .range(start, end);

    if (filters.name) {
      query = query.ilike("name", `%${filters.name}%`);
    }

    if (filters.branchIds && filters.branchIds.length > 0) {
      return from(
        this.supabaseService.sb
          .from("SessionsBranches")
          .select("sessionId")
          .in("branchId", filters.branchIds),
      ).pipe(
        switchMap(({ data, error }) => {
          if (error) {
            return throwError(() => error);
          }
          const sessionIds = data?.map((item) =>
            item.sessionId
          ).filter((id): id is string => id !== null) || [];
          if (sessionIds.length === 0) {
            return from([{ data: [], error: null }]);
          }
          return from(query.in("id", sessionIds));
        }),
      ) as any;
    }
    return from(query) as any;
  }

  /**
   * Update a session record along with its associated branches.
   * @param id The session ID.
   * @param session Partial session data to update.
   * @returns Observable with the update result.
   */
  updateSession(
    id: string,
    session: any,
    branchIds: string[],
  ): Observable<any> {
    return from(
      this.supabaseService.sb.from("Sessions").update(session).eq(
        "id",
        id,
      ),
    ).pipe(
      switchMap(({ error }) => {
        if (error) {
          return throwError(() => error);
        }

        return from(
          this.supabaseService.sb.from("SessionsBranches").delete().eq(
            "sessionId",
            id,
          ),
        ).pipe(
          switchMap(() => {
            const branchInserts = branchIds.map((branchId: string) => ({
              sessionId: id,
              branchId,
            }));
            return from(
              this.supabaseService.sb.from("SessionsBranches").insert(
                branchInserts,
              ),
            );
          }),
        );
      }),
    );
  }

  /**
   * Delete a session record by ID.
   * @param id The session ID.
   * @returns Observable with the deletion result.
   */
  deleteSessions(id: string): Observable<any> {
    return from(
      this.supabaseService.sb.from("Sessions").delete().eq("id", id),
    );
  }
}
