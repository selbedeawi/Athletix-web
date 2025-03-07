import { inject, Injectable, signal } from "@angular/core";
import { BehaviorSubject, from, Observable } from "rxjs";
import { Tables } from "../../../../../database.types";
import { SupabaseService } from "../supabase/supabase.service";

@Injectable({
  providedIn: "root",
})
export class BranchesService {
  private supabase = inject(SupabaseService);

  private branchesSubject = new BehaviorSubject<
    { key: string; value: Tables<"Branch"> }[] | null
  >(null);
  private currentBranchSubject = new BehaviorSubject<Tables<"Branch"> | null>(
    null,
  );
  get currentBranch$(): Observable<Tables<"Branch"> | null> {
    return this.currentBranchSubject.asObservable();
  }
  get branches$(): Observable<
    { key: string; value: Tables<"Branch"> }[] | null
  > {
    return this.branchesSubject.asObservable();
  }

  get currentBranch(): Tables<"Branch"> | null {
    return this.currentBranchSubject.value;
  }

  value = signal({} as Tables<"Branch">);
  setSelectedBranch(Branch: Tables<"Branch"> | undefined) {
    if (Branch) {
      this.currentBranchSubject.next(Branch);
      this.value.set(Branch);
    }
  }
  getBranches(staffId: string, selectedBranch?: Tables<"Branch">) {
    from(
      this.supabase.sb
        .from("StaffBranch")
        .select("*, Branch(id, name)")
        .eq("staffId", staffId),
    ).subscribe((res) => {
      if (res.data) {
        let branches = res.data.map((d) => {
          return {
            key: d.Branch.name,
            value: d.Branch,
          };
        });
        this.branchesSubject.next(branches);
        this.setSelectedBranch(branches[0].value);
      }
    });
  }
  clearUser() {
    this.branchesSubject.next(null);
    this.currentBranchSubject.next(null);
  }
}
