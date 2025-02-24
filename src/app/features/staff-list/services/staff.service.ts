import { inject, Injectable } from "@angular/core";
import { catchError, from, map, Observable, throwError } from "rxjs";
import { StaffAccount } from "../models/staff";
import { SupabaseService } from "../../../core/services/supabase/supabase.service";

@Injectable({
  providedIn: "root",
})
export class StaffService {
  private supabaseService = inject(SupabaseService);
  constructor() {}

  /**
   * Create a new staff record.
   * @param staff StaffAccount object with staff details.
   * @returns Observable with the insertion result.
   */
  /**
   * Create a new staff account by calling the Supabase Edge Function.
   * @param staff A NewStaffAccount object containing staff details and password.
   * @returns An Observable with the result of the function invocation.
   */
  createStaffAccount(staff: StaffAccount) {
    return from(
      this.supabaseService.sb.functions.invoke("create-staff", {
        body: staff,
      }),
    );
  }

  /**
   * Retrieve a staff record by ID.
   * @param id The staff member's ID.
   * @returns Observable emitting the StaffAccount.
   */
  getStaff(id: string): Observable<StaffAccount> {
    return from(
      this.supabaseService.sb
        .from("Staff")
        .select("*")
        .eq("id", id)
        .single(),
    ).pipe(map((res: any) => res.data as StaffAccount));
  }

  /**
   * Retrieve all staff records.
   * @returns Observable emitting an array of StaffAccount.
   */
  getAllStaff(): Observable<StaffAccount[]> {
    return from(
      this.supabaseService.sb
        .from("Staff")
        .select("*"),
    ).pipe(map((res: any) => res.data as StaffAccount[]));
  }

  /**
   * Update a staff record.
   * @param id The staff member's ID.
   * @param staff Partial staff data to update.
   * @returns Observable with the update result.
   */
  updateStaff(id: string, staff: Partial<StaffAccount>): Observable<any> {
    return from(
      this.supabaseService.sb
        .from("Staff")
        .update(staff)
        .eq("id", id),
    );
  }

  /**
   * Delete a staff record by ID.
   * @param id The staff member's ID.
   * @returns Observable with the deletion result.
   */
  deleteStaff(id: string): Observable<any> {
    return from(
      this.supabaseService.sb
        .from("Staff")
        .delete()
        .eq("id", id),
    );
  }
}
