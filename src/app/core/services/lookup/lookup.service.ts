import { inject, Injectable, signal } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Database } from "../../../../../database.types";

import { DropdownOptionsModel } from "../../../shared/ui-components/atoms/select/select.model";
import { SupabaseService } from "../supabase/supabase.service";

@Injectable({ providedIn: "root" })
export class LookupService {
  private supabase = inject(SupabaseService);
  private cache = new Map<
    keyof Database["public"]["Tables"],
    BehaviorSubject<DropdownOptionsModel<string | string[]>[]>
  >();

  getOptions(
    key: keyof Database["public"]["Tables"],
  ): Observable<DropdownOptionsModel<string | string[]>[]> {
    if (!this.cache.has(key)) {
      this.cache.set(
        key,
        new BehaviorSubject<DropdownOptionsModel<string | string[]>[]>([]),
      );
      this.fetchOptions(key);
    }
    return this.cache.get(key)!.asObservable();
  }

  private async fetchOptions(key: keyof Database["public"]["Tables"]) {
    const { data, error } = await this.supabase.sb
      .from(key)
      .select("*")
      .limit(1000);

    if (error) {
      console.error("Error fetching lookup options:", error);
      return;
    }

    if (data) {
      this.cache.get(key)?.next(data.map((item: any) => ({
        key: item.name,
        value: item.id,
      })));
    }
  }
}
