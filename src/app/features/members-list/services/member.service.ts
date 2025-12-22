import { inject, Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { SupabaseService } from '../../../core/services/supabase/supabase.service';
import { BEResponse } from '../../../shared/models/shared-models';
import { AllMembersFilter, MemberAccount } from '../models/member';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private supabaseService = inject(SupabaseService);
  constructor() {}

  /**
   * Create a new member by calling the Supabase Edge Function.
   * @param member A Member object containing details and password.
   * @returns An Observable with the result of the function invocation.
   */
  createMember(member: MemberAccount) {
    return from(
      this.supabaseService.sb.functions.invoke('create-member', {
        body: member,
      })
    );
  }

  /**
   * Retrieve a member record by ID.
   * @param id The member's ID.
   * @returns Observable emitting the Member details.
   */
  getMember(id: string): Observable<MemberAccount> {
    return from(
      this.supabaseService.sb.from('Members').select('*').eq('id', id).single()
    ).pipe(map((res: any) => res.data)) as Observable<MemberAccount>;
  }

  /**
   * Retrieve paginated member records with optional filters.
   * @param filters Filtering parameters.
   * @param page Page number (starting from 1).
   * @param pageSize Number of items per page.
   * @returns Observable emitting a paginated response of Members.
   */
  getAllMembers(
    filters: AllMembersFilter,
    page: number = 1,
    pageSize: number = 10
  ) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = this.supabaseService.sb
      .from('Members')
      .select(
        '*, UserMembership!inner(*,  salesStaff:Staff!UserMembership_salesId_fkey(firstName, lastName))',
        { count: 'exact' }
      );

    if (filters.searchQuery) {
      query = query.or(
        `firstName.ilike.%${filters.searchQuery}%,lastName.ilike.%${filters.searchQuery}%,memberId.ilike.%${filters.searchQuery}%,nationalId.ilike.%${filters.searchQuery}%,phoneNumber.ilike.%${filters.searchQuery}%`
      );
    }

    // Filter by branchId if provided
    if (filters.branchId) {
      query = query.eq('UserMembership.branchId', filters.branchId);
    }

    // Filter by membershipId if provided
    if (filters.membershipId && filters.membershipId !== 'All') {
      query = query.eq('UserMembership.membershipId', filters.membershipId);
    }

    // Filter by type if provided
    // Apply membership type filtering based on filters.types and coachId
    if (
      filters.types &&
      filters.types.includes('PrivateCoach') &&
      filters.coachId
    ) {
      query = query.in('UserMembership.type', filters.types);
      query = query.or(`coachId.eq.${filters.coachId},coachId.is.null`, {
        referencedTable: 'UserMembership',
      });
    } else {
      // When no special coachId condition is needed, apply type filtering as usual.
      if (filters.type) {
        query = query.eq('UserMembership.type', filters.type);
      }
      if (filters.types) {
        query = query.in('UserMembership.type', filters.types);
      }
    }

    if (filters.endDateFrom) {
      query = query.gte(
        'UserMembership.endDate',
        this.formatDate(filters.endDateFrom as any)
      );
    }
    if (filters.endDateTo) {
      query = query.lte(
        'UserMembership.endDate',
        this.formatDate(filters.endDateTo as any)
      );
    }
    if (filters.createdFrom) {
      query = query.gte(
        'UserMembership.createdAt',
        this.formatDate(filters.createdFrom as any)
      );
    }
    if (filters.createdTo) {
      query = query.lte(
        'UserMembership.createdAt',
        this.formatDate(filters.createdTo as any)
      );
    }
    if (typeof filters.isActive === 'boolean') {
      query.eq('UserMembership.isActive', filters.isActive);
    }
    if (typeof filters.isActiveUser === 'boolean') {
      query.eq('hasActiveMembership', filters.isActiveUser);
    }
    if (filters.salesId) {
      query.eq('UserMembership.salesId', filters.salesId);
    }

    if (typeof filters.isFreeze === 'boolean') {
      query.eq('UserMembership.isFreeze', filters.isFreeze);
    }
    if (typeof filters.isCanceled === 'boolean') {
      query.eq('UserMembership.isCanceled', filters.isCanceled);
    }
    query = query.eq('isDeleted', false);
    query = query.range(start, end);
    return from(query);
  }

  /**
   * Update a member record.
   * @param id The member's ID.
   * @param member Partial member data to update.
   * @returns Observable with the update result.
   */
  updateMember(id: string, member: any): Observable<any> {
    return from(
      this.supabaseService.sb.from('Members').update(member).eq('id', id)
    );
  }

  /**
   * Delete a staff record by ID.
   * @param id The staff member's ID.
   * @returns Observable with the deletion result.
   */
  deleteMember(userId: string): Observable<any> {
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

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    // Months are 0-based so we add 1
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  }
}
