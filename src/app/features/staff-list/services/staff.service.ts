import { inject, Injectable } from '@angular/core';
import {
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { StaffAccount } from '../models/staff';
import { SupabaseService } from '../../../core/services/supabase/supabase.service';
import { BEResponse } from '../../../shared/models/shared-models';
import { AccountType } from '../../../core/enums/account-type-enum';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private supabaseService = inject(SupabaseService);
  constructor() {}

  /**
   * Create a new staff account by calling the Supabase Edge Function.
   * @param staff A NewStaffAccount object containing staff details and password.
   * @returns An Observable with the result of the function invocation.
   */
  createStaffAccount(staff: StaffAccount) {
    return from(
      this.supabaseService.sb.functions.invoke('create-staff', {
        body: staff,
      })
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
        .from('Staff')
        .select('*, StaffBranch(branchId)')
        .eq('id', id)
        .single()
    ).pipe(
      map((res: any) => {
        res.data.branchIds = [];
        res.data.StaffBranch.forEach((element: any) => {
          res.data.branchIds.push(element.branchId);
        });
        return res.data as StaffAccount;
      })
    );
  }

  /**
   * Retrieve paginated staff records with optional filters.
   * @param filters Filtering parameters.
   * @param page Page number (starting from 1).
   * @param pageSize Number of items per page.
   * @returns Observable emitting a paginated response of StaffAccount.
   */
  getAllStaff(
    filters: {
      name?: string;
      isActive?: boolean | 'All';
      role?: AccountType | null;
      branchIds?: string[];
    },
    page: number = 1,
    pageSize: number = 10
  ): Observable<BEResponse<StaffAccount[]>> {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    if (filters.branchIds && filters.branchIds.length > 0) {
      // First, get the staff IDs related to the given branch IDs
      return from(
        this.supabaseService.sb
          .from('StaffBranch')
          .select('staffId')
          .in('branchId', filters.branchIds)
      ).pipe(
        switchMap(({ data, error }) => {
          if (error) {
            return throwError(() => error);
          }

          const staffIds = data?.map((item) => item.staffId) || [];
          if (staffIds.length === 0) {
            return of({ data: [], error: null });
          }

          // Now, fetch staff details using the retrieved staff IDs
          let query = this.supabaseService.sb
            .from('Staff')
            .select('*, StaffBranch(branchId, Branch(name)))', {
              count: 'exact',
            });

          if (filters.name) {
            query.or(
              `firstName.ilike.%${filters.name}%,lastName.ilike.%${filters.name}%`
            );
          }
          if (filters.isActive !== undefined && filters.isActive !== 'All') {
            query = query.eq('isActive', filters.isActive);
          }
          if (filters.role) {
            query = query.eq('role', filters.role);
          }
          query = query.eq('isDeleted', false);
          // Apply staff ID filtering
          query = query.in('id', staffIds).range(start, end);
          // Sort by first name (ascending order)
          query = query.order('firstName', { ascending: true });
          return from(query) as any;
        })
      ) as Observable<BEResponse<StaffAccount[]>>;
    }

    // If no branchIds filtering is required, query Staff directly
    let query = this.supabaseService.sb
      .from('Staff')
      .select('*, StaffBranch(branchId, Branch(name))', {
        count: 'exact',
      });

    if (filters.name) {
      query = query.or(
        `firstName.ilike.%${filters.name}%,lastName.ilike.%${filters.name}%`
      );
    }
    if (filters.isActive !== undefined && filters.isActive !== 'All') {
      query = query.eq('isActive', filters.isActive);
    }
    if (filters.role) {
      query = query.eq('role', filters.role);
    }
    query = query.eq('isDeleted', false);
    query = query.range(start, end);
    // Sort by first name (ascending order)
    query = query.order('firstName', { ascending: true });
    return from(query) as any;
  }

  /**
   * Update a staff record.
   * @param id The staff member's ID.
   * @param staff Partial staff data to update.
   * @returns Observable with the update result.
   */
  updateStaffWithBranches(
    staffId: string,
    staffData: StaffAccount,
    branchIds: string[]
  ): Observable<any> {
    return from(
      this.supabaseService.sb.rpc('update_staff_with_branches', {
        staff_id: staffId,
        first_name: staffData.firstName,
        last_name: staffData.lastName,
        is_active: staffData.isActive,
        phone_number: staffData.phoneNumber || '',
        new_branch_ids: branchIds || [],
      })
    );
  }

  /**
   * Delete a staff record by ID.
   * @param id The staff member's ID.
   * @returns Observable with the deletion result.
   */
  deleteStaff(userId: string): Observable<any> {
    return from(
      this.supabaseService.sb.functions.invoke('delete-user', {
        method: 'PATCH',
        body: { userId },
      })
    );
  }
  updateEmail(userId: string, newEmail: string): Observable<any> {
    return from(
      this.supabaseService.sb.functions.invoke('update-user-email', {
        method: 'PATCH',
        body: { userId, newEmail },
      })
    );
  }
  updatePassword(userId: string, newPassword: string): Observable<any> {
    return from(
      this.supabaseService.sb.functions.invoke('update-user-password', {
        method: 'PATCH',
        body: { userId, newPassword },
      })
    );
  }
}
